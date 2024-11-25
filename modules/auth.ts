import { JwtPayload, verify } from 'jsonwebtoken';
import { jwt } from 'config';
import { Request, Response } from 'modules/core';
import * as rsp from 'modules/respond';

const verifyJwt = (token: string): Promise<string | JwtPayload | undefined> => new Promise(resolve => verify(token, jwt.secret, (err, decoded) => resolve([err, decoded])));

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
    console.warn('not handling some token cases');
    respond.badRequest('not handling some token cases');
    return;
  }

  return admin;
};
