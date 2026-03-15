import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, _: Request, res: Response, next: NextFunction) => {
  // Log error for debugging
  // eslint-disable-next-line no-console
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
};

export default errorHandler;
