import bcrypt from "bcrypt";
import { createHash } from "crypto";

const salt_rounds = 10;

export function hashPassword(value:string) : Promise<string> {
    return bcrypt.hash(value,salt_rounds);
}

export function sha256(value:string):string {
    return createHash("sha256").update(value).digest("hex");
}

export function comparePassword(value:string,hash:string):Promise<boolean> {
    return bcrypt.compare(value,hash);
}