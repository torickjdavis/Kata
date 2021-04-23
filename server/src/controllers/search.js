import mongoose from 'mongoose';
import status from 'http-status';
import Kata from '../models/Kata.js';
import Workshop from '../models/Workshop.js';

export default async function search(req, res, next) {
  const resource = req.params.resource.toLowerCase();

  let model = null;
  if (resource === 'kata' || resource === 'katas') model = Kata;
  if (resource === 'workshop' || resource === 'workshops') model = Workshop;

  if (!model) {
    return res
      .status(status.NOT_FOUND)
      .json({ message: `Unsupported Resource ${resource}` });
  }

  // TODO remove commented code
  // couldn't get search to work
  // const instances = await model
  //   .search({
  //     text: {
  //       path: ['title', '_id'],
  //       query: req.query.q,
  //       fuzzy: {},
  //     },
  //   })
  //   .project('title _id')
  //   .exec();

  const { q } = req.query;
  try {
    const id = mongoose.Types.ObjectId(q);
    const instance = await model.findById(id).exec();
    return res.json({ [model.collection.name]: [instance] });
  } catch (error) {
    // prettier-ignore
    const argumentError = 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters';
    if (
      error.message !== argumentError &&
      !(error instanceof mongoose.Error.CastError)
    ) {
      return next(error);
    }
  }

  try {
    const instances = await model
      .find({
        title: {
          $regex: q.split(/\b/).join('|'),
          $options: 'i',
        },
      })
      .exec();

    res.json({ [model.collection.name]: instances });
  } catch (error) {
    next(error);
  }
}
