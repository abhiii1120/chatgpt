import { userModel } from "../models/user.model.js";

class UserDao {

    async createUser(input:{ name:string;email:string;paswordHash:string}){
        const user = await userModel.create(input);
        return user;
    }

    async findByEmail(email:string){
        return userModel.findOne({email:email.toLowerCase()});
    }

    async findById(userId:string){
        return userModel.findById(userId);
    }

    
}