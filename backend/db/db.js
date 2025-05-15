import mongoose from 'mongoose';
import { connect } from 'mongoose';

async function connectDB() {
  try {
    await connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export { connectDB };