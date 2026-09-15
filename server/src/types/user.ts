type UserModel = {
    id:string,
    name:string,
    email:string,
    password:string,
}

export type RegisterUserRequest = Pick<UserModel , "name" | "email" | "password">