import mongoose from 'mongoose';
import status from 'http-status';
import Kata from '../models/Kata.js';
import Workshop from '../models/Workshop.js';
import { queryToBoolean, modelRefPaths } from '../utils.js';

export default async function search(req, res, next) {
  const resource = req.params.resource.toLowerCase();

  let { populate = false } = req.query;
  populate = queryToBoolean(populate);

  let model = null;
  if (resource === 'kata' || resource === 'katas') model = Kata;
  if (resource === 'workshop' || resource === 'workshops') model = Workshop;

  if (!model) {
    return res
      .status(status.NOT_FOUND)
      .json({ message: `Unsupported Resource ${resource}` });
  }

  const { q } = req.query;
  try {
    const id = mongoose.Types.ObjectId(q);

    let query = model.findById(id);

    if (populate) {
      const refPaths = modelRefPaths(model);
      for (const path of refPaths) query = query.populate(path);
    }

    const instance = await query.exec();
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
    let query = model.find({
      title: {
        $regex: q
          .split(/\s+/)
          .map((w) => `(${w})`)
          .join('|'),
        $options: 'i',
      },
    });

    if (populate) {
      const refPaths = modelRefPaths(model);
      for (const path of refPaths) query = query.populate(path);
    }

    const instances = await query.exec();

    res.json({ [model.collection.name]: instances });
  } catch (error) {
    next(error);
  }
}
