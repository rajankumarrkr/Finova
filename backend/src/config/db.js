import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  try {
    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(env.MONGO_URI, options);
    console.log(`[MongoDB Connected]: ${conn.connection.host} (${conn.connection.name})`);

    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB Runtime Error]: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB Warning]: Disconnected from DB');
    });

  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    // In production or dev environment without DB running, app stays up or retries
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB]: Connection closed gracefully');
  } catch (err) {
    console.error(`[MongoDB Error on Close]: ${err.message}`);
  }
};
