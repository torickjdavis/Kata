import status from 'http-status';
import Kata from '../models/Kata.js';
import User from '../models/User.js';

export async function getUserKatas(req, res) {
  const instances = await Kata.find({ creator: req.params.id }).exec();
  res.json(instances);
}

export async function downloadKata(req, res, next) {
  try {
    const kata = await Kata.findById(req.params.kataId).select('zip').exec();
    res.type('zip').send(kata.zip);
  } catch (error) {
    next(error);
  }
}

export async function createSubmission(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).exec();
    if (!user.submissions) user.submissions = [];
    user.submissions.push(req.body);
    await user.save();
    res.json({
      message: 'Submission Created',
      submissionId: user.submissions[user.submissions.length - 1]._id,
    });
  } catch (error) {
    next(error);
  }
}

export async function listSubmissions(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select('+submissions')
      .populate('submissions.kata')
      .exec();

    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: 'No user found.' });
    }

    const submissions = user.submissions || [];

    if (submissions.length === 0) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: 'Nothing submitted yet.' });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res.json(submissions);
    }
    res.status(status.FORBIDDEN).json({
      // prettier-ignore
      message: 'These submissions are not public and you are not authenticated as the submitter.',
    });
  } catch (error) {
    next(error);
  }
}

export async function getSubmission(req, res, next) {
  try {
    console.log(req.params);
    const { userId, submissionId } = req.params;
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(status.NOT_FOUND).json({ message: 'No user found.' });
    }

    const submission = user.submissions.find((s) => s._id === submissionId);

    if (!submission) {
      return res
        .status(status.NOT_FOUND)
        .json({ message: 'No submission found.' });
    }
    console.log('req.user', req.user);
    if (user._id.toString() === req.user._id.toString()) {
      return res.json(submission);
    }
    if (submission.public) return res.json(submission);
    res.status(status.FORBIDDEN).json({
      // prettier-ignore
      message: 'This submission is not public and you are not authenticated as the submitter.',
    });
  } catch (error) {
    next(error);
  }
}
