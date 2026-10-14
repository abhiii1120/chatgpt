import express from "express";
import ErrorHandler from "../middlewares/errorhandler.js";
import morgan from "morgan";
import { router } from "../routes/index.js";
import cookieParser from "cookie-parser";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"));

app.use(express.static(path.join(__dirname,"..","public")))

app.use("/api/v1",router);

app.get("*namme",(_req,res) => {
    res.sendFile(path.join(__dirname,"..","public","index.html"));
})

app.use(ErrorHandler)