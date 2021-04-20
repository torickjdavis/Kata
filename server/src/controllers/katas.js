import Kata from '../models/Kata.js';

export async function getUserKatas(req, res) {
  const instances = await Kata.find({ creator: req.params.id }).exec();
  res.json(instances);
}
