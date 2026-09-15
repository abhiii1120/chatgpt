import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface AppError extends Error {
  statusCode?: number;
}

let ErrorHandler = (error:AppError,_req:Request,res:Response,_next:NextFunction) => {
    
    return res.status(error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
        message:error.message ?? "Internal server error",
        success:false
    })
}

export default ErrorHandler;