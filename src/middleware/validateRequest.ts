import type { NextFunction, Request, Response } from 'express';
import { AnyZodObject, coerce, object, string, ZodError } from 'zod';
import ApiError from '../errors/ApiError';
import { formatZodErrorMessage } from '../errors/formatErrors';

const querySchema = object({
  sort: string({ required_error: 'Sort query is invalid' }).optional(),
  take: coerce
    .number({ required_error: 'Take query is invalid' })
    .min(-20, 'Take query must be at least -20')
    .max(20, 'Take query can be at most 20')
    .optional(),
  skip: coerce
    .number({ required_error: 'Skip query is invalid' })
    .min(0, 'Skip query must be at least 0')
    .max(50, 'Skip query can be at most 50')
    .optional(),
  cursor: coerce.number({ required_error: 'Cursor query is invalid' }).int({ message: 'Cursor query must be a whole number' }).optional(),
});

function validateRequest(schema?: AnyZodObject) {
  return (req: Request, __: Response, next: NextFunction) => {
    try {
      if (schema) {
        schema.parse({ body: req.body, params: req.params });
      }
      querySchema.parse({ query: req.query });
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        next(ApiError.badRequest(formatZodErrorMessage(err.issues)));
        return;
      }
      next(ApiError.badRequest(err.message));
    }
  };
}

export default validateRequest;
