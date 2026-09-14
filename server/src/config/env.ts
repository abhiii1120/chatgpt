import dotenv from "dotenv";
import type { AppEnv } from "../types/env.js";
 
dotenv.config();

function required(name:string,fallback?:string):string{
    let value = process.env[name] ?? fallback;
    if(!value) throw new Error(`missing environment variable: ${name}`);

    return value;
}

export const env : AppEnv = {
    port : Number(process.env.PORT ?? 5000),
    mongoUri : required("MONGODB_URI"),
    nodeEnv:process.env.NODE_ENV ?? "development",
}