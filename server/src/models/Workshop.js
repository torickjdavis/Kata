import mongoose from 'mongoose';

export default mongoose.model(
  'workshop',
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
    katas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'kata' }],
  })
);
