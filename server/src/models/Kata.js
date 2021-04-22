import mongoose from 'mongoose';

export default mongoose.model(
  'kata',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      index: true,
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
    zip: {
      type: Buffer,
      select: false,
      required: true,
    },
  })
);
