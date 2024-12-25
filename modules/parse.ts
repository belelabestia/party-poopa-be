import { isDateString } from './date';

type ParseResult<T> =
  | { error: string, value?: undefined }
  | { value: T, error?: undefined };

export const object = ({ error, value }: ParseResult<unknown>) => {
  const make = (data: ParseResult<object>) => ({
    ...data,
    property: (key: string) => property(data, key)
  });

  if (error !== undefined) return make({ error });
  if (typeof value !== 'object' || !value) return make({ error: 'should be an object' });

  return make({ value });
};

export const property = ({ error, value }: ParseResult<object>, key: string) => {
  const make = (data: ParseResult<unknown>) => ({
    ...data,
    number: () => number(data),
    string: () => string(data)
  });

  if (error !== undefined) return make({ error });
  if (key in value === false) return make({ error: 'missing property' });

  return make({ value: (value as Record<string, unknown>)[key] });
};

export const array = ({ error, value }: ParseResult<unknown>) => {
  const make = (data: ParseResult<unknown[]>) => ({
    ...data,
    single: () => single(data)
  });

  if (error !== undefined) return make({ error });
  if (!Array.isArray(value)) return make({ error: 'should be an array' });

  return make({ value });
};

export const single = ({ error, value }: ParseResult<unknown[]>) => {
  const make = (data: ParseResult<unknown>) => ({
    ...data,
    object: () => object(data)
  });

  if (error !== undefined) return make({ error });
  if (value.length !== 1) return make({ error: 'should have one element' });

  return make({ value: value[0] });
};

export const number = ({ error, value }: ParseResult<unknown>) => {
  const make = (data: ParseResult<number>) => ({
    ...data,
    greaterThanZero: () => greaterThanZero(data)
  });

  if (error !== undefined) return make({ error });
  if (typeof value !== 'number' || Number.isNaN(value)) return make({ error: 'should be a number' });

  return make({ value });
};

export const string = ({ error, value }: ParseResult<unknown>) => {
  const make = (data: ParseResult<string>) => ({
    ...data,
    nonEmpty: () => nonEmpty(data),
    date: () => date(data)
  });

  if (error !== undefined) return make({ error });
  if (typeof value !== 'string') return make({ error: 'should be a string' });

  return make({ value });
};

declare const brand: unique symbol;
type Branded<T, K extends string> = T & { [brand]: K };

type GreaterThanZero = Branded<number, 'greater than zero'>;

export const greaterThanZero = ({ error, value }: ParseResult<number>) => {
  if (error !== undefined) return { error };
  if (value < 1) return { error: 'should be greater than zero' };

  return { value: value as GreaterThanZero };
};

type NonEmpty = Branded<string, 'non empty'>;

export const nonEmpty = ({ error, value }: ParseResult<string>) => {
  if (error !== undefined) return { error };
  if (value.trim().length === 0) return { error: 'should not be empty' };

  return { value: value as NonEmpty };
};

type Date = Branded<string, 'date'>;

export const date = ({ error, value }: ParseResult<string>): ParseResult<Date> => {
  if (error !== undefined) return { error };
  if (!isDateString(value)) return { error: 'should be a date string (YYYY-MM-DD)' };

  return { value: value as Date };
};
