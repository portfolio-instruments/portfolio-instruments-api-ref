import { TaxShelter } from '@prisma/client';
import { coerce, nativeEnum, object, string, TypeOf } from 'zod';

export const createAccountRequestSchema = object({
  body: object({
    institution: string({ required_error: 'Institution is required' })
      .min(2, 'Name must be at least 2 characters long')
      .max(255, 'Name can be at most 255 characters long'),
    taxShelter: nativeEnum(TaxShelter),
    description: string().optional(),
    active: coerce.boolean({ invalid_type_error: 'The active status must be a boolean value' }).optional(),
  }),
});

export type CreateAccountRequest = TypeOf<typeof createAccountRequestSchema>;
export type CreateAccountContext = CreateAccountRequest['body'];
