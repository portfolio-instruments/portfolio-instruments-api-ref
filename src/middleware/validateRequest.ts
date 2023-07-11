import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject, ZodEffects } from 'zod';
import { coerce, object, string, ZodError } from 'zod';
import ApiError from '../errors/ApiError';
import { formatZodErrorMessage } from '../errors/formatErrors';

const querySchema = object({
  // e.g. filter=[institution=Vanguard;active=true]
  filter: string().optional(),

  // e.g. startDate=2023-01-10
  startDate: coerce.date({ invalid_type_error: 'Start date format is invalid.' }).optional(),

  // e.g. endDate=2023-01-10
  endDate: coerce.date({ invalid_type_error: 'End date format is invalid.' }).optional(),

  // e.g. select=id,institution,active
  select: string().optional(),

  // e.g. sort=id,updatedAt / sort=-createdAt
  sort: string().optional(),

  // e.g. take=5
  take: coerce
    .number({ required_error: 'Take query is invalid' })
    .min(-20, 'Take query must be at least -20')
    .max(20, 'Take query can be at most 20')
    .optional(),

  // e.g. skip=5
  skip: coerce
    .number({ required_error: 'Skip query is invalid' })
    .min(0, 'Skip query must be at least 0')
    .max(50, 'Skip query can be at most 50')
    .optional(),

  // e.g. cursor=5
  cursor: coerce.number({ required_error: 'Cursor query is invalid' }).int({ message: 'Cursor query must be a whole number' }).optional(),

  // e.g. expand=true
  expand: coerce.boolean({ invalid_type_error: 'Expand query is invalid.' }).optional(),
});

function validateRequest(schema?: AnyZodObject | ZodEffects<AnyZodObject>) {
  return (req: Request, __: Response, next: NextFunction) => {
    try {
      if (schema) {
        schema.parse({ body: req.body as unknown, params: req.params });
      }
      querySchema.parse({ query: req.query });
      next();
    } catch (e: unknown) {
      const err = e as Error;
      if (err instanceof ZodError) {
        next(ApiError.badRequest(formatZodErrorMessage(err.issues)));
        return;
      }
      next(ApiError.badRequest(err.message));
    }
  };
}

export default validateRequest;
