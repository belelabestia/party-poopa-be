import * as rsp from '$/respond';
import { Request } from '$/server';

type Respond = ReturnType<typeof rsp.init>;
type Credentials = { username?: unknown, password?: unknown };

export const login = (req: Request, respond: Respond) => {
  if (!req.body || typeof req.body !== 'object') {
    console.log('missing body, rejecting login');
    respond.badRequest('body is required');
    return;
  }

  const { username, password } = req.body as Credentials;

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
