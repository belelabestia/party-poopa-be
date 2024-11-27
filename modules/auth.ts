import { verify } from 'jsonwebtoken';
import { jwt } from 'config';
import { Request, Response } from 'modules/core';
import * as rsp from 'modules/respond';

const verifyJwt = (token: string) => new Promise(resolve => verify(token, jwt.secret, (err, decoded) => resolve([err, decoded])));

export const authenticate = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const respond = rsp.init(res);

  if (!token) {
    console.log('no token provided');
    respond.unauthorized('no token');
    return;
  }

  const admin = await verifyJwt(token);

  if (typeof admin !== 'object') {
    console.log('invalid token type');
    respond.badRequest('invalid token type');
    return;
  }

  return admin;
};
