import { verify } from 'jsonwebtoken';
import { jwt } from 'config';
import { Request, Response } from '$/server';
import * as rsp from '$/respond';
import * as err from '$/error';

type Admin = { username: string };
type JwtResult = [Error | null, Admin | null];

const verifyJwt = (token: string) => new Promise<JwtResult>(resolve => verify(token, jwt.secret, (err, decoded) => resolve([err, decoded as Admin ?? null])));

export const authenticate = async (req: Request, res: Response) => {
  console.log('authenticating request');

  const respond = rsp.init(res);
  const { token } = req.cookies as { token?: unknown };

  if (!token || typeof token !== 'string') {
    console.log('no valid token provided');
    respond.unauthorized('no valid token');
    return;
  }

  const [error, admin] = await verifyJwt(token);

  if (error) {
    console.log('token validation failed', { message: error.message });
    respond.unauthorized(error.message);
    return;
  }

  if (!admin) throw err.make('no decoded token');

  return admin;
};
