import { NextFunction, Request, Response } from 'express';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.statusCode || 500;
    const message = err.message;
    const data = err.data;

    res.status(status).json({ message, data });
};
