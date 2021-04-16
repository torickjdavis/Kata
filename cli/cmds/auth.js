const inquirer = require('inquirer');
const api = require('../api');
const { info } = require('../stores');

module.exports.command = 'auth <action>';

module.exports.describe = 'access the system';

module.exports.builder = (yargs) => {
  yargs.positional('action', {
    choices: ['login', 'register'],
  });
};

module.exports.handler = async (argv) => {
  const { action } = argv;
  if (action === 'login') return login();
  if (action === 'register') return register();
};

const loginQuestions = [
  {
    type: 'input',
    name: 'email',
    message: 'Email:',
  },
  {
    type: 'password',
    name: 'password',
    message: 'Password:',
    mask: '*',
  },
];

async function login() {
  try {
    const answers = await inquirer.prompt(loginQuestions);
    const response = await api.post('/login', answers);
    await info.store.set(info.keys.ACCESS_TOKEN, response.data.accessToken);
    console.log('You are logged in.');
  } catch (error) {
    // prettier-ignore
    if (error.isTtyError) return console.error('Sorry, the prompt could not be rendered.');
    // prettier-ignore
    if (error.response) return console.error('There was an issue logging you in. Please check your email and password.');
    console.error('An Unhandled Error Ocurred', error);
  }
}

const registerQuestions = [
  {
    type: 'input',
    name: 'firstName',
    message: 'First Name:',
  },
  {
    type: 'input',
    name: 'lastName',
    message: 'Last Name:',
  },
  ...loginQuestions,
];

async function register() {
  try {
    const answers = await inquirer.prompt(registerQuestions);
    await api.post('/user', {
      name: {
        first: answers.firstName,
        last: answers.lastName,
      },
      email: answers.email,
      password: answers.password,
    });
    console.log(`${answers.firstName}, you've been registered. Please login.`);
  } catch (error) {
    // prettier-ignore
    if (error.isTtyError) return console.error('Sorry, the prompt could not be rendered.');
    // prettier-ignore
    if (error.response) return console.error('A user already exists with that email, please login.');
    console.error('An Unhandled Error Ocurred', error);
  }
}
