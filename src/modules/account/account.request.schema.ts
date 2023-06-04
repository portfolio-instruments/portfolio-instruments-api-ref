import { TaxShelter } from '@prisma/client';
import type { TypeOf } from 'zod';
import { coerce, nativeEnum, object, string } from 'zod';

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

/** Create */
export const createAccountRequestSchema = object({
  body: bodySchema.strict(),
});

export type CreateAccountRequest = TypeOf<typeof createAccountRequestSchema>;

/** Read */
export const getAccountByIdRequestSchema = object({
  params: paramsSchema.strict(),
});

export type GetAccountRequest = { params: { accountId: string } };

/** Update */
export const patchAccountRequestSchema = object({
  body: bodySchema.partial().strict(),
  params: paramsSchema.strict(),
});

export type PatchAccountRequest = { body: TypeOf<typeof patchAccountRequestSchema>['body'] } & { params: { accountId: string } };

export const putAccountRequestSchema = object({
  body: bodySchema.strict().refine((req) => req.active !== undefined, { message: 'The active status must be provided' }),
  params: paramsSchema.strict(),
});

export type PutAccountRequest = { body: TypeOf<typeof putAccountRequestSchema>['body'] } & { params: { accountId: string } };

/** Delete */
export const deleteAccountByIdRequestSchema = object({
  params: paramsSchema.strict(),
});

export type DeleteAccountRequest = { params: { accountId: string } };
