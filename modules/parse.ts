import { isDateString } from './date';
import { makeFail, Error } from './error';
import { Union } from './union';

type ParseResult<T> = Union<{ error: Error, value: T }>;

const fail = makeFail('parse error');

export const object = ({ error, value }: ParseResult<unknown>) => {
  const make = (result: ParseResult<object>) => ({
    ...result,
    property: (key: string) => property(result, key)
  });

  if (error) return make({ error });
  if (typeof value !== 'object' || !value) return make({ error: fail('should be an object') });

  return make({ value });
};

export const property = ({ error, value }: ParseResult<object>, key: string) => {
  const make = (result: ParseResult<unknown>) => ({
    ...result,
    number: () => number(result),
    string: () => string(result)
  });

  if (error) return make({ error });
  if (key in value === false) return make({ error: fail(`missing property ${key}`) });

  return make({ value: (value as Record<string, unknown>)[key] });
};

export const array = ({ error, value }: ParseResult<unknown>) => {
  const make = (result: ParseResult<unknown[]>) => ({
    ...result,
    single: () => single(result)
  });

  if (error) return make({ error });
  if (!Array.isArray(value)) return make({ error: fail('should be an array') });

  return make({ value });
};

export const single = ({ error, value }: ParseResult<unknown[]>) => {
  const make = (result: ParseResult<unknown>) => ({
    ...result,
    object: () => object(result)
  });

  if (error) return make({ error });
  if (value.length !== 1) return make({ error: fail('should have one element') });

  return make({ value: value[0] });
};

export const number = ({ error, value }: ParseResult<unknown>) => {
  const make = (result: ParseResult<number>) => ({
    ...result,
    greaterThanZero: () => greaterThanZero(result)
  });

  if (error) return make({ error });
  if (typeof value !== 'number' || Number.isNaN(value)) return make({ error: fail('should be a number') });

  return make({ value });
};

export const string = ({ error, value }: ParseResult<unknown>) => {
  const make = (result: ParseResult<string>) => ({
    ...result,
    nonEmpty: () => nonEmpty(result),
    date: () => date(result)
  });

  if (error) return make({ error });
  if (typeof value !== 'string') return make({ error: fail('should be a string') });

  return make({ value });
};

declare const brand: unique symbol;
type Branded<T, K extends string> = T & { [brand]: K };

type GreaterThanZero = Branded<number, 'greater than zero'>;

export const greaterThanZero = ({ error, value }: ParseResult<number>) => {
  if (error) return { error };
  if (value < 1) return { error: fail('should be greater than zero') };

  return { value: value as GreaterThanZero };
};

type NonEmpty = Branded<string, 'non empty'>;

export const nonEmpty = ({ error, value }: ParseResult<string>) => {
  if (error) return { error };
  if (value.trim().length === 0) return { error: fail('should not be empty') };

  return { value: value as NonEmpty };
};

type Date = Branded<string, 'date'>;

export const date = ({ error, value }: ParseResult<string>) => {
  if (error) return { error };
  if (!isDateString(value)) return { error: fail('should be a date string (YYYY-MM-DD)') };

  return { value: value as Date };
};
