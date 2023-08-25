import { NextFunction, Request, Response } from "express";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { ValidationError } from "joi";
import CustomError from "./CustomeError";
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
export const globalErrorHandler = (
  err: Error, // | MulterError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /** errors related to JWT */
  if (err instanceof JsonWebTokenError) {
    /*
      'invalid token' - the header or payload could not be parsed
      'jwt malformed' - the token does not have three components (delimited by a .)
      'jwt signature is required'
      'invalid signature'
      'jwt audience invalid. expected: [OPTIONS AUDIENCE]'
      'jwt issuer invalid. expected: [OPTIONS ISSUER]'
      'jwt id invalid. expected: [OPTIONS JWT ID]'
      'jwt subject invalid. expected: [OPTIONS SUBJECT]'
    */
    return res.status(401).send({
      success: false,
      message: err.message,
    });
  }
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({
      success: false,
      message: err.message,
    });
  }
  if (err instanceof NotBeforeError) {
    // Thrown if current time is before the nbf claim.
    return res.status(401).send({
      success: false,
      message: err.message,
    });
  }
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      success: false,
      message: err.message,
    });
  }
  if (err instanceof ValidationError) {
    return res.status(400).send(err.message);
  }
  // console.log();
  return res.status(400).send(err.message);
};
