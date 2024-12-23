import * as parse from '$/parse';
import { Request } from '$/server';
import { QueryResult } from 'pg';

export const loginRequest = (req: Request) => {
  const obj = parse.object({ value: req.body });

  const username = obj.property('username').string().nonEmpty();
  if (username.error !== undefined) return { error: username.error };

  const password = obj.property('password').string().nonEmpty();
  if (password.error !== undefined) return { error: password.error };

  return { data: { username: username.value, password: password.value } };
};

export const loginResult = (result: QueryResult) => {
  const rows = parse.array({ value: result.rows });
  if (rows.value?.length === 0) return { unauthorized: true };

  const password_hash = parse.single(rows).object().property('password_hash').string().nonEmpty();
  if (password_hash.error !== undefined) return { error: password_hash.error };

  return { admin: { password_hash: password_hash.value } };
};
