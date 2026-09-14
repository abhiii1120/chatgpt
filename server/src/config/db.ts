import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
    await mongoose.connect("mongodb://localhost:27017/chatgpt");

    console.log("Connected to MongoDB");
}