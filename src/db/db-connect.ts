import mongoose from "mongoose";
const { MONGO_URI } = process.env;

export const connectDB = async () => {
  try {
    const mongoUri = MONGO_URI as string;
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}