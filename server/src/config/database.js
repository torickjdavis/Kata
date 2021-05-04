import mongoose from 'mongoose';

const { MONGO_URI } = process.env;

export async function connect() {
  try {
    const db = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.debug('MongoDB Database Connected');
    return db;
  } catch (error) {
    console.error(`MongoDB Database Connection Error: ${error}`);
  }
}
