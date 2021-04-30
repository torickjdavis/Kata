import status from 'http-status';
import User from '../models/User.js';

export async function verify(req, res, next) {
  const validPassword = await User.verifyPassword(
    req.body.email,
    req.body.password
  );

  if (!validPassword) return res.sendStatus(status.FORBIDDEN);
  return res.sendStatus(status.OK);
}

export async function authenticate(req, res, next) {
  try {
    const validPassword = await User.verifyPassword(
      req.body.email,
      req.body.password
    );

    if (!validPassword) return res.sendStatus(status.FORBIDDEN);

    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user)
      return res
        .status(status.NOT_FOUND)
        .json({ message: `No ${User.modelName} Found` });

    const accessToken = await user.generateToken();

    res.json({ accessToken, user }); // user details in signed token
  } catch (error) {
    next(error);
  }
}

// export async function logout(req, res, next) {}
