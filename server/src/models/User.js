import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ObjectId = mongoose.Types.ObjectId;

// TODO check versioning

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
  submissions: [
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
        files: [
          {
            name: String,
            contents: String,
          },
        ],
        tests: [
          {
            name: String,
            passed: Boolean,
            points: Number,
          },
        ],
        score: Number,
        rawJestOutput: String,
      },
      {
        timestamps: true,
      }
    ),
  ],
});

UserSchema.virtual('name.full').get(function () {
  return [this.name.first || null, this.name.last || null]
    .filter((v) => !!v)
    .join(' ');
});

UserSchema.pre('validate', async function () {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

UserSchema.statics.verifyPassword = async function (email, plainTextPassword) {
  const user = await this.findOne({ email }).select('+password').exec();
  if (!user) throw new Error('Not Found');
  return await bcrypt.compare(plainTextPassword, user.password);
};

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

export default mongoose.model('user', UserSchema);
