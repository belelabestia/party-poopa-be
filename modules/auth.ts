import { verify } from 'jsonwebtoken';
import { jwt } from 'config';
import { Request } from '$/server';
import * as parse from '$/parse';

type Admin = { username: string };

type JwtResult =
  | { error: string, value?: undefined }
  | { value: Admin, error?: undefined };

const verifyJwt = (token: string) => new Promise<JwtResult>(resolve => verify(token, jwt.secret, (error, decoded) => {
  if (error) {
    resolve({ error: error.message });
    return;
  }

  const username = parse.object({ value: decoded }).property('username').string().nonEmpty();

  if (username.error !== undefined) {
    resolve({ error: username.error });
    return;
  }

  resolve({ value: { username: username.value } });
}));

export const authenticate = async (req: Request) => {
  const token = parse.object({ value: req.cookies }).property('token').string().nonEmpty();
  if (token.error !== undefined) return { error: token.error };

  const admin = await verifyJwt(token.value);
  if (admin.error !== undefined) return { error: admin.error };

  return { admin: admin.value };
};
