import { verify } from 'jsonwebtoken';
import { jwt } from 'config';
import { Request, Response } from 'modules/core';
import * as rsp from 'modules/respond';

type Admin = { username: string };
type JwtResult = [Error | null, Admin | undefined];

const verifyJwt = (token: string) => new Promise<JwtResult>(resolve => verify(token, jwt.secret, (err, decoded) => resolve([err, decoded as Admin])));

export const authenticate = async (req: Request, res: Response) => {
  console.log('authenticating request');

  const token = req.cookies.token;
  const respond = rsp.init(res);

  if (!token) {
    console.log('no token provided');
    respond.unauthorized('no token');
    return;
  }

  const [error, admin] = await verifyJwt(token);

  if (error) {
    console.log('token validation failed', { message: error.message });
    respond.unauthorized(error.message);
    return;
  }

  if (!admin) throw new Error('no decoded token');

  return admin;
};
