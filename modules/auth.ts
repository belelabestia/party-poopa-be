import { verify } from 'jsonwebtoken';
import { jwt } from 'config';
import { Request } from '$/server';
import { Error, makeFail } from './error';
import { Union } from './union';
import * as parse from '$/parse';

type Admin = { username: string };
type JwtResult = Union<{ error: Error, value: Admin }>;

const fail = makeFail('auth error');

const verifyJwt = (token: string) => new Promise<JwtResult>(resolve => verify(token, jwt.secret, (error, decoded) => {
  if (error) {
    resolve({ error: fail(error) });
    return;
  }

  const username = parse.object({ value: decoded }).property('username').defined().string().nonEmpty();

  if (username.error) {
    resolve({ error: fail(username.error) });
    return;
  }

  resolve({ value: { username: username.value } });
}));

export const authenticate = async (req: Request) => {
  const token = parse.object({ value: req.cookies }).property('token').defined().string().nonEmpty();
  if (token.error) return { error: fail(token.error) };

  const admin = await verifyJwt(token.value);
  if (admin.error) return { error: fail(admin.error) };

  return { admin: admin.value };
};
