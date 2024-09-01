import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Successfully connected to db");
  } catch (error) {
    console.error("Error connecting to db: ", error);
  }
};
