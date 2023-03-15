import { capitalize } from 'lodash';
import { ZodIssue } from 'zod';

interface ResponseError {
  error: {
    status: number;
    message: string;
  };
}

export function formatResponseError(status: number, message: string): ResponseError {
  return {
    error: {
      status,
      message,
    },
  };
}

export function formatZodErrorMessage(errors: ZodIssue[]): string {
  let message: string = '';

  errors?.forEach((e: ZodIssue) => {
    if (e.path?.length && e.message) {
      // Path often times has a 'body' value, remove it before joining to string
      const bodyPosition = e.path.findIndex((p) => p === 'body');
      if (bodyPosition !== -1) {
        e.path.splice(bodyPosition, 1);
      }

      message += `${capitalize(e.path?.join())}: ${e.message}; `;
    }
  });

  return message || 'Invalid request body';
}
