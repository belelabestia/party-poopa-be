import * as rsp from '$/respond';
import { Request } from '$/server';
import { QueryResult } from 'pg';

type Respond = ReturnType<typeof rsp.init>;

type LoginRequest = { username: string, password: string };

export const loginRequest = (req: Request, respond: Respond) => {
  if (!req.body || typeof req.body !== 'object') {
    console.log('missing body, rejecting login');
    respond.badRequest('body is required');
    return;
  }

  const { username, password } = req.body as LoginRequest;

  if (!username || !password) {
    console.log('missing username or password, rejecting login');
    respond.badRequest('username and password are required');
    return;
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    console.log('wrong username or password format, rejecting login');
    respond.badRequest('username and password must be strings');
    return;
  }

  return { username, password };
};

type LoginResult = { password_hash: string };

export const loginResult = (result: QueryResult, respond: Respond, username: string) => {
  const row = result.rows[0] as LoginResult;

  if (!row) {
    console.log('admin not found, login failed', { username });
    respond.unauthorized('wrong credentials');
    return;
  }

  const { password_hash } = row;

  if (typeof password_hash !== 'string' || !password_hash) {
    console.log('wrong password hash format, login failed');
    respond.internalServerError();
    return;
  }

  return { password_hash };
};
