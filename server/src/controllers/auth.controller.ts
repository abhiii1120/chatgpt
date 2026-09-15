import type { Request, Response } from "express";
import type { RegisterUserRequest } from "../types/user.js";
import { userDao } from "../dao/user.dao.js";
import alreadyExistsError from "../utils/errors/alreadyExists.js";
import { hashPassword } from "../utils/crypto.js";

export const register = async (req:Request , res:Response) => {
    const {email,password,name} = req.body as RegisterUserRequest;

    const isExisting = await userDao.findByEmail(String(email));
    if(isExisting){
        throw new alreadyExistsError("User already exists")
    }

    const passwordHash = await hashPassword(String(password));

    const user = await userDao.createUser({
        name:String(name),
        email:String(email).toLowerCase(),
        passwordHash,
    });

    
}