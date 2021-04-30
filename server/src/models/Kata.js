import mongoose from 'mongoose';
import Workshop from './Workshop.js';

const KataSchema = new mongoose.Schema({
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
});

KataSchema.post('remove', async function () {
  const id = this._id;
  await Workshop.updateMany({ katas: [id] }, { $pull: { katas: [id] } }).exec();
  await User.updateMany(
    { 'submissions.kata': [id] },
    { $pull: { 'submissions.kata': [id] } }
  );
});

export default mongoose.model('kata', KataSchema);
