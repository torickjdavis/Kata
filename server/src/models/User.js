import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const ObjectId = mongoose.Types.ObjectId;

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

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

UserSchema.pre('validate', async function () {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// TODO check versioning

UserSchema.methods.verifyPassword = async function (plainText) {
  // TODO verify authentication check works
  return bcrypt.compare(plainText, this.password);
};
export default mongoose.model('user', UserSchema);
