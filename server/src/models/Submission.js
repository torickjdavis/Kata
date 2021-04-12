import mongoose from 'mongoose';

import Kata from './Kata.js';
import User from './User.js';

const ObjectId = mongoose.Types.ObjectId;

export default mongoose.model(
  'submission',
  new mongoose.Schema(
    {
      kata: {
        type: ObjectId,
        ref: Kata,
        required: true,
      },
      submitter: {
        type: ObjectId,
        ref: User,
        required: true,
      },
      files: [
        {
          name: String,
          contents: String,
        },
      ],
      tests: [
        {
          name: String,
          passed: Boolean,
          points: Number,
        },
      ],
      score: Number,
      rawJestOutput: String,
    },
    {
      timestamps: true,
    }
  )
);
