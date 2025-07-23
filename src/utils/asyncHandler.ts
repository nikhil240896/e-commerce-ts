import { Request, Response, NextFunction } from 'express';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const asyncHandler = (requestHandler: AsyncRequestHandler) => {
  // Used to handle web requests
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next))
      .catch((err: Error) => {
        console.log("error=====>>>>>", err.message);
        next(err); // Pass error to the next middleware (error handler)
      });
  };
};

export default asyncHandler;
