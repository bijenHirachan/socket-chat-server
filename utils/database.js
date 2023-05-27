import mongoose from "mongoose";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

const connectDB = catchAsyncErrors(async () => {
  const { connection } = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDB connected to host: ${connection.host}`);
});

export default connectDB;
