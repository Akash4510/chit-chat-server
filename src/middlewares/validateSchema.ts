import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const validateSchema =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (e: any) {
      return res.status(400).json({
        status: 'error',
        message: e.issues[0].message,
      });
    }
  };

export default validateSchema;
