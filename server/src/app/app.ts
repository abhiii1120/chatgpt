import express from "express";
import ErrorHandler from "../middlewares/errorhandler.js";
import morgan from "morgan";

export const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(ErrorHandler)