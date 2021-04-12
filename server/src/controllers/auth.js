import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const { JWT_SECRET } = process.env;

export async function authenticate(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(404).json({ message: `No ${User.modelName} Found` });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) return res.sendStatus(403);

    // TODO implement refresh tokens
    const accessToken = jwt.sign(user.toJSON(), JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({ accessToken }); // user details in signed token
  } catch (error) {
    next(error);
  }
}

// export async function logout(req, res, next) {}

// middleware to protect a route
// export function authenticateToken(req, res, next) {
//   const authorization = req.headers['authorization'];
//   const [, token] = authorization.split(' '); // Bearer TOKEN

//   if (!token) return res.status(401).json();

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.status();
//     req.user = User.hydrate(user);
//     next();
//   });
// }
