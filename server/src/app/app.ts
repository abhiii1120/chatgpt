import express from "express";
import ErrorHandler from "../middlewares/errorhandler.js";
import morgan from "morgan";
import { router } from "../routes/index.js";

export const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1",router);

app.use(ErrorHandler)