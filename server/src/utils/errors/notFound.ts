import { StatusCodes } from "http-status-codes";
import { ApiError } from "./apiError.js";

export default class notFound extends ApiError {
    constructor(message:string,details:string = ""){
        super(message,details,StatusCodes.NOT_FOUND);
        }
}