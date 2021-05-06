const fs = require('fs');
const os = require('os');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const api = require('../api');
const archive = require('../archive');
const { kata: kataStore, info } = require('../stores');
const {
  fileTimestamp,
  findResourceId,
  handleAxiosError,
  exec,
} = require('../utils');

module.exports.command = ['submit'];

// prettier-ignore
module.exports.describe = 'submit solution to Kata';

module.exports.builder = (yargs) => {
  yargs.option('path', {
    alias: 'p',
    type: 'string',
    describe: 'path of Kata to submit',
    default: '.',
  });
};

module.exports.handler = async (argv) => {
  const accessToken = await info.store.get(info.keys.ACCESS_TOKEN);
  const user = await info.store.get(info.keys.USER);

  // prettier-ignore
  if (!user) return console.log('You must be signed in to create a submission.');

  const { path: kataPath } = argv;
  let kataId = await kataStore.store.get(path.resolve(kataPath));
  if (!kataId) {
    const { search } = await inquirer.prompt([
      {
        type: 'input',
        name: 'search',
        message: `Couldn't find Kata associated with path. What Kata are you submitting to?`,
      },
    ]);
    kataId = await findResourceId('kata', search);
    if (!kataId) {
      return console.error(`No Kata found by searching for "${search}"`);
    }
    await kataStore.store.set(path.resolve(kataPath), kataId);
  }

  const { public } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'public',
      // prettier-ignore
      message: 'Do you want to create a public sharable URL for this submission?',
      default: true,
    },
  ]);

  let tmpJSONPath = null;
  try {
    const getKataRes = await api.get(`/kata/${kataId}`);
    const kata = getKataRes.data;
    tmpJSONPath = path.join(
      os.tmpdir(),
      `kata.${kataId}.${fileTimestamp()}.json`
    );

    process.chdir(kataPath);

    try {
      console.log('Running Tests in', kataPath);
      await exec(`jest --json --outputFile=${tmpJSONPath}`);
    } catch (error) {
      const isJestPass = typeof error === 'string' && error.includes('PASS');
      const isJestFail = !!error.message?.includes('FAIL');
      // jest will error if any tests fail, skip it's error
      if (!(isJestPass || isJestFail)) throw error;
    }

    const pointsRegex = /\[(-?\d+\.?\d*?)pts?\]/;
    const data = fs.readFileSync(tmpJSONPath, 'utf-8');
    const rawJestOutput = JSON.parse(data);
    const {
      success,
      testResults,
      startTime,
      numFailedTests,
      numPassedTests,
      numTotalTests,
    } = rawJestOutput;

    let maxPossibleScore = 0;

    const tests = {
      counts: {
        failed: numFailedTests,
        passed: numPassedTests,
        total: numTotalTests,
      },
      results: testResults
        .flatMap(({ assertionResults }) => assertionResults)
        .map(({ ancestorTitles, title, status }) => {
          let [match, points] = title.match(pointsRegex) || [];
          const name = [
            ancestorTitles.join(' > '),
            title.replace(' ' + match, ''),
          ]
            .filter((p) => p.length) // name part
            .join(': ');

          if (!points) {
            console.error(`Points Not Defined for "${name}"`);
            points = 0;
          }

          points = Number(points);

          let pointsEarned = 0;

          if (points > 0) maxPossibleScore += points;

          if (status === 'failed' && points < 0) pointsEarned = points;
          if (status !== 'failed' && points > 0) pointsEarned = points;

          return {
            name,
            status,
            points: pointsEarned,
          };
        })
        .filter((r) => r !== null),
    };

    const humanOutput = {
      success,
      score: tests.results.reduce((sum, result) => sum + result.points, 0),
      maxPossibleScore,
      timestamp: startTime,
      tests,
    };

    console.log('Creating Submission');

    const submitted = await api.post(
      `/submission/${user._id}`,
      {
        ...humanOutput,
        kata: kataId,
        kataVersion: kata.version,
        public,
        rawJestOutput,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log('Submission Received');
  } catch (error) {
    console.error('Submission Creation Failed');
    if (error.isAxiosError) handleAxiosError(error);
    else console.error(error);
  } finally {
    if (tmpJSONPath && fs.existsSync(tmpJSONPath)) {
      fs.unlinkSync(tmpJSONPath);
    }
  }
};
