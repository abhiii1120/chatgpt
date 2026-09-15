export class ApiError extends Error {
  statusCode: number;
  details: string;

  constructor(message: string, details: string = "", statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "ApiError";
  }
}
