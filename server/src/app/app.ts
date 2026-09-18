import express from "express";
import ErrorHandler from "../middlewares/errorhandler.js";
import morgan from "morgan";
import { router } from "../routes/index.js";
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"));

app.use("/api/v1",router);

app.use(ErrorHandler)