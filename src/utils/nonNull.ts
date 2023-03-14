export function nonNullProp<TSource, TKey extends keyof TSource>(source: TSource, key: TKey): NonNullable<TSource[TKey]> {
  if (isNullOrUndefined(source[key])) {
    throw new Error(`Property ${String(key)} is null or undefined`);
  }
  return source[key] as NonNullable<TSource[TKey]>;
}

export function nonNullValue<T>(value: T): NonNullable<T> {
  if (isNullOrUndefined(value)) {
    throw new Error(`Value is null or undefined`);
  }
  return value as NonNullable<T>;
}

function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}
