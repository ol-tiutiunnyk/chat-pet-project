import * as t from 'io-ts';

export const isNil = (input: unknown): input is null | undefined =>
  t.union([t.null, t.undefined]).is(input);

export const isString = (data: unknown): data is string => {
  return t.string.is(data) && data.trim().length > 0;
};

export const isNumber = (data: unknown): data is number => {
  return t.number.is(data) && Number.isFinite(data);
};
