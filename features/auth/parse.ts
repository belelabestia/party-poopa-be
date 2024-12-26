import { makeFail } from '$/error';
import * as parse from '$/parse';
import { Request } from '$/server';
import { QueryResult } from 'pg';

const fail = makeFail('login parse error');

export const loginRequest = (req: Request) => {
  const obj = parse.object({ value: req.body });

  const username = obj.property('username').string().nonEmpty();
  if (username.error) return { error: fail(username.error) };

  const password = obj.property('password').string().nonEmpty();
  if (password.error) return { error: fail(password.error) };

  return { admin: { username: username.value, password: password.value } };
};

export const loginResult = (result: QueryResult) => {
  const rows = parse.array({ value: result.rows });
  if (rows.value?.length === 0) return { unauthorized: Symbol() };

  const password_hash = parse.single(rows).object().property('password_hash').string().nonEmpty();
  if (password_hash.error) return { error: fail(password_hash.error) };

  return { password_hash: password_hash.value };
};
