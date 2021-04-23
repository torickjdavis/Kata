import { Router } from 'express';
// import status from 'statuses';
import status from 'http-status';
import mongoose from 'mongoose';

// Create
export const create = ({ model }) => async (req, res, next) => {
  // use body and let schema validation handle keys
  try {
    const instance = new model(req.body);
    await instance.save();
    res.status(status.CREATED).json(instance);
  } catch (error) {
    next(error);
  }
};

// Read
export const read = ({ model, name }) => async (req, res, next) => {
  try {
    const id = req.params.id;

    let { populate = false } = req.query;
    populate = queryToBoolean(populate);
    let query = model.findById(id);
    if (populate) {
      const refPaths = modelRefPaths(model);
      for (const path of refPaths) query = query.populate(path);
    }

    const instance = await query.exec();
    if (instance) res.json(instance);
    else {
      res
        .status(status.NOT_FOUND)
        .json({ message: `No ${name} Found (${id})` });
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(status.BAD_REQUEST).json({
        message: `Invalid ${error.kind}`,
        reason: error.reason.message,
      });
    } else next(error);
  }
};

// Update
export const replace = ({ model, name }) => async (req, res, next) => {
  try {
    const id = req.params.id;
    await model.findOneAndReplace({ _id: id }, req.body).exec();
    res.json({
      success: true,
      message: `Replaced ${name} Instance (${id})`,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(status.BAD_REQUEST).json({
        message: `Invalid ${error.kind}`,
        reason: error.reason.message,
      });
    } else next(error);
  }
};

export const modify = ({ model, name }) => async (req, res, next) => {
  try {
    const id = req.params.id;
    await model.findByIdAndUpdate(id, req.body).exec();
    res.json({
      success: true,
      message: `Modified ${name} Instance (${id})`,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(status.BAD_REQUEST).json({
        message: `Invalid ${error.kind}`,
        reason: error.reason.message,
      });
    } else next(error);
  }
};

// Delete (Remove)
export const remove = ({ model, name }) => async (req, res, next) => {
  try {
    const id = req.params.id;
    await model.findByIdAndDelete(id).exec();
    res.json({
      success: true,
      message: `Removed ${name} Instance (${id})`,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(status.BAD_REQUEST).json({
        message: `Invalid ${error.kind}`,
        reason: error.reason.message,
      });
    } else next(error);
  }
};

// List (Paginated)
export const list = ({ model, collection }) => async (req, res, next) => {
  try {
    let { limit = 10, page = 1, all = false, populate = false } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    all = queryToBoolean(all);
    populate = queryToBoolean(populate);

    if (isNaN(limit) || limit !== Number(limit)) {
      return res
        .status(status.BAD_REQUEST)
        .json({ message: 'Limit must be an Integer.' });
    }

    if (isNaN(page) || page !== Number(page)) {
      return res
        .status(status.BAD_REQUEST)
        .json({ message: 'Page must be an Integer.' });
    }

    let query = model.find({});
    if (!all) {
      query = query
        .skip(limit * Math.max(page - 1, 0)) // no lower than the first page (0)
        .limit(limit);
    }
    if (populate) {
      const refPaths = modelRefPaths(model);
      for (const path of refPaths) query = query.populate(path);
    }
    const instances = await query.exec();
    const total = await model.countDocuments({}).exec();
    res.json({
      [collection]: instances,
      meta: {
        count: instances.length, // normally will be equal to limit, except for the final page
        total,
        page: all ? 1 : page,
        pages: all ? 1 : Math.ceil(total / limit),
        limit: all ? total : limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// prettier-ignore
const queryToBoolean = (query) => typeof query === 'boolean' ? query : query !== 'false';

const wrappedModel = (model) => ({
  model,
  name: model.modelName,
  collection: model.collection.name,
});

const modelRefPaths = (model) => {
  const refPaths = [];
  for (const [name, path] of [
    ...Object.entries(model.schema.paths),
    ...Object.entries(model.schema.subpaths),
  ]) {
    if (path.options.ref) refPaths.push(name.replace('.$', '')); // make arrays into key
  }
  return refPaths;
};

export function resource(model) {
  const router = new Router();
  const wrapped = wrappedModel(model);
  const { name } = wrapped;

  router.post(`/${name}`, create(wrapped));
  router
    .route(`/${name}/:id`)
    .get(read(wrapped))
    .put(replace(wrapped))
    .patch(modify(wrapped))
    .delete(remove(wrapped));
  router.get(`/${name}`, list(wrapped));

  return router;
}

export default resource;
