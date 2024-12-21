import * as rsp from '$/respond';
import { Request } from '$/server';
import { QueryResult } from 'pg';

type Respond = ReturnType<typeof rsp.init>;

type GetAllAdminsResult = { id: number, username: string }[];

export const getAllAdminsResult = (result: QueryResult) => {
  const admins: GetAllAdminsResult = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows[i] as unknown;

    if (typeof row !== 'object') return { error: 'row should be an object' };
    if (!row) return { error: 'row should not be null' };

    if ('id' in row === false) return { error: 'missing id field' };
    const id = row.id;

    if (typeof id !== 'number') return { error: 'id should be a number' };
    if (Number.isNaN(id)) return { error: 'id should not be NaN' };
    if (id < 1) return { error: 'id should be greater than 0' };

    if ('username' in row === false) return { error: 'missing username field' };
    const username = row.username;

    if (typeof username !== 'string') return { error: 'username should be a string' };
    if (!username) return { error: 'username should not be empty' };

    admins.push({ id, username });
  }

  return { admins };
};

export const createAdminRequest = (req: Request) => {
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

export const createAdminResult = (result: QueryResult) => {
  const rows = result.rows as unknown[];

  if (rows.length !== 1) return { error: 'result should be one row' };
  const row = rows[0];

  if (typeof row !== 'object') return { error: 'first row should be an object' };
  if (!row) return { error: 'first row should not be null' };

  if ('id' in row === false) return { error: 'missing id field' };
  const id = row.id;

  if (typeof id !== 'number') return { error: 'id should be a number' };
  if (Number.isNaN(id)) return { error: 'id should not be NaN' };
  if (id < 1) return { error: 'id should be greater than 0' };

  return { id };
};

export const updateAdminUsernameRequest = (req: Request) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) return { error: 'id should be a number' };
  if (id < 1) return { error: 'id should be greater than 0' };

  if (typeof req.body !== 'object') return { error: 'body should be an object' };
  if (!req.body) return { error: 'body should not be null' };

  if ('username' in req.body === false) return { error: 'missing username field' };
  const username = req.body.username;

  if (typeof username !== 'string') return { error: 'username should be a string' };
  if (!username) return { error: 'username should not be empty' };

  return { data: { id, username } };
};

export const updateAdminPasswordRequest = (req: Request) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) return { error: 'id should be a number' };
  if (id < 1) return { error: 'id should be greater than 0' };

  if (typeof req.body !== 'object') return { error: 'body should be an object' };
  if (!req.body) return { error: 'body should not be null' };

  if ('password' in req.body === false) return { error: 'missing password field' };
  const password = req.body.password;

  if (typeof password !== 'string') return { error: 'password should be a string' };
  if (!password) return { error: 'password should not be empty' };

  return { data: { id, password } };
};

export const deleteAdminRequest = (req: Request) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) return { error: 'id should be a number' };
  if (id < 1) return { error: 'id should be greater than 0' };

  return { id };
};
