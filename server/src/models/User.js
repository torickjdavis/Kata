import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Kata from './Kata.js';
import Workshop from './Workshop.js';

const { ObjectId, Mixed } = mongoose.Schema.Types;

const SALT_ROUNDS = 10;
const { JWT_SECRET } = process.env;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    first: String,
    last: String,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  submissions: {
    type: [
      new mongoose.Schema(
        {
          kata: {
            type: ObjectId,
            ref: 'kata',
            required: true,
          },
          kataVersion: String,
          public: {
            type: Boolean,
            default: false,
          },
          success: Boolean,
          score: Number,
          maxPossibleScore: Number,
          tests: {
            counts: {
              failed: Number,
              passed: Number,
              total: Number,
            },
            results: [
              {
                name: String,
                passed: Boolean,
                points: Number,
              },
            ],
          },
          rawJestOutput: Mixed,
        },
        {
          timestamps: true,
        }
      ),
    ],
    select: false,
  },
});

UserSchema.virtual('name.full').get(function () {
  return [this.name.first || null, this.name.last || null]
    .filter((v) => !!v)
    .join(' ');
});

UserSchema.pre('validate', async function () {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  }
});

UserSchema.static('verifyPassword', async function (email, plainTextPassword) {
  const user = await this.findOne({ email }).select('+password').exec();
  if (!user) throw new Error('Not Found');
  return await bcrypt.compare(plainTextPassword, user.password);
});

UserSchema.methods.generateToken = async function () {
  return jwt.sign(this.toJSON(), JWT_SECRET, {
    expiresIn: '1d',
  });
};

UserSchema.static('verifyToken', async function (token) {
  const User = this;
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, user) => {
      if (error) reject(error);
      resolve(User.hydrate(user));
    });
  });
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

UserSchema.post('remove', async function () {
  const userId = this._id;
  await Workshop.deleteMany({ creator: userId }).exec();
  await Kata.deleteMany({ creator: userId }).exec();
});

export default mongoose.model('user', UserSchema);
