type UserModel = {
    id:string,
    name:string,
    email:string,
    password:string,
}

export type RegisterUserRequest = Pick<UserModel , "name" | "email" | "password">

export type UserResponse = Omit<UserModel , "password">

export type LoginUserRequest = Pick<UserModel , "email"|"password">