import bcrypt from "bcrypt";

const salt_rounds = 10;

export function hashPassword(value:string) : Promise<string> {
    return bcrypt.hash(value,salt_rounds);
}
