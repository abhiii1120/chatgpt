import { StatusCodes } from "http-status-codes";
import { ApiError } from "./apiError.js";

export default class alreadyExistsError extends ApiError {
  constructor(message: string, details: string = "") {
    super(message, details, StatusCodes.CONFLICT);
  }
}
