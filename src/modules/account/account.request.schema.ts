import { TaxShelter } from '@prisma/client';
import { coerce, nativeEnum, object, string, TypeOf } from 'zod';

/** Query-able keys */
export const queryAbleAccountKeys: string[] = ['id', 'institution', 'taxShelter', 'description', 'active', 'createdAt', 'updatedAt'];

/** Base Schema */
const bodySchema = object({
  institution: string({ required_error: 'Institution is required' })
    .min(2, 'Name must be at least 2 characters long')
    .max(255, 'Name can be at most 255 characters long'),
  taxShelter: nativeEnum(TaxShelter),
  description: string(),
  active: coerce.boolean({ invalid_type_error: 'The active status must be a boolean value' }).optional(),
});

const paramsSchema = object({
  accountId: coerce
    .number({ invalid_type_error: 'The accountId must be a positive whole number' })
    .int('The accountId must be a whole number')
    .positive('The accountId must be a positive number'),
});

/** Create Account */
export const createAccountRequestSchema = object({
  body: bodySchema.strict(),
});

export type CreateAccountRequest = TypeOf<typeof createAccountRequestSchema>;

/** Edit Account */
export const editAccountRequestSchema = object({
  body: bodySchema.partial().strict(),
  params: paramsSchema.strict(),
});

export type EditAccountRequest = { body: TypeOf<typeof editAccountRequestSchema>['body'] } & { params: { accountId: string } };

/** Get Account By Id */
export const getAccountByIdRequestSchema = object({
  params: paramsSchema.strict(),
});

export type GetAccountRequest = { params: { accountId: string } };

/** Delete Account By Id */
export const deleteAccountByIdRequestSchema = object({
  params: paramsSchema.strict(),
});

export type DeleteAccountRequest = { params: { accountId: string } };
