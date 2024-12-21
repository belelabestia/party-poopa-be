import * as rsp from '$/respond';
import { Request } from '$/server';
import { QueryResult } from 'pg';

export const loginRequest = (req: Request) => {
  if (typeof req.body !== 'object') return { error: 'body should be an object' };
  if (!req.body) return { error: 'body should not be null' };

  if ('username' in req.body === false) return { error: 'missing username field' };
  if ('password' in req.body === false) return { error: 'missing password field' };

  const { username, password } = req.body;

  if (typeof username !== 'string') return { error: 'username should be a string' };
  if (!username) return { error: 'username should not be empty' };

  if (typeof password !== 'string') return { error: 'password should be a string' };
  if (!password) return { error: 'password should not be empty' };

  return { data: { username, password } };
};

export const loginResult = (result: QueryResult) => {
  const rows = result.rows as unknown[];

  if (rows.length === 0) return { unauthorized: true };

  if (rows.length !== 1) return { error: 'result should be one row' };
  const row = rows[0];

  if (typeof row !== 'object') return { error: 'row should be an object' };
  if (!row) return { error: 'row should not be null' };

  if ('password_hash' in row === false) return { error: 'missing password_hash field' };
  const password_hash = row.password_hash;

  if (typeof password_hash !== 'string') return { error: 'password_hash should be a string' };
  if (!password_hash) return { error: 'password_hash should not be empty' };

  return { admin: { password_hash } };
};
