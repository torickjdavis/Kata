import mongoose from 'mongoose';

export default mongoose.model(
  'workshop',
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
    katas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'kata' }],
  })
);
