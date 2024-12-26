export type Cause = string | symbol | {};

export type Error = {
  name: string,
  cause: Cause;
};

export const makeFail = (name: string) => (cause: Cause = Symbol()): Error => ({ name, cause });
