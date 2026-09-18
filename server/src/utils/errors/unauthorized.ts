import { StatusCodes } from "http-status-codes";
import { ApiError } from "./apiError.js";

export default class unauthorizedError extends ApiError{
    constructor(message:string,details:string=''){
        super(message,details,StatusCodes.UNAUTHORIZED);
    }
}