export interface ExpandFields<F> {
  fields: F;
  hrefs: string;
}

/**
 * @remarks Use this function to expand empty fields that you specify with href values.
 * (Returns an object with all the correct typings)
 */
export function expandEmptyFields<T extends object, F extends string>(obj: T, expandFields: ExpandFields<F>[]) {
  return expandEmptyFieldsUtility(
    obj,
    expandFields.map((ef) => ef.fields),
    expandFields.map((ef) => ef.hrefs)
  );
}

function expandEmptyFieldsUtility<T extends object, F extends string>(obj: T, fields: F[], values: string[]): T & Record<F, { href: string }> {
  if (fields.length !== values.length) {
    throw new Error('Fields and values must have the same length.');
  }

  const expandedObj = { ...obj };
  for (let i = 0; i < fields.length; i++) {
    if (!obj[fields[i] as unknown as keyof T]) {
      expandedObj[fields[i] as unknown as keyof T] = { href: values[i] } as any;
    }
  }

  return expandedObj as T & Record<F, { href: string }>;
}
