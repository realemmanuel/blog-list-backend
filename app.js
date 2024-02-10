import { info } from "./utils/logger.js";
import { MONGODB_URI } from "./utils/config.js";
import express from "express";
import "express-async-errors";
import cors from "cors";
import { blogRouter } from "./controllers/blog.js";
import {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} from "./utils/middleware.js";
import mongoose from "mongoose";

const app = express();

mongoose.set("strictQuery", false);

info("Connecting to", MONGODB_URI);

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    info("Connected to MongoDB");
  } catch (error) {
    error("Error connecting to MongoDB:", error.message);
  }
};
connectToMongoDB();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(requestLogger);

app.use("/api/blogs", blogRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
