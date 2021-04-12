import mongoose from 'mongoose';

export default mongoose.model(
  'kata',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    version: String,
    runScript: String,
    files: [
      {
        name: String,
        contents: String,
      },
    ],
  })
);
