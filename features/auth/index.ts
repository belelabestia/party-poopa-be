import * as rsp from '$/respond';
import * as sql from './sql';
import * as parse from './parse';
import { compare } from 'bcryptjs';
import { jwt } from 'config';
import { Express } from 'express';
import { sign } from 'jsonwebtoken';
import * as db from '$/db';
import { Request, Response } from '$/server';

type Cookie = {
  cookie: (name: string, token: string) => void,
  clearCookie: (name: string) => void
};

const login = async (req: Request, res: Response & Cookie) => {
  console.log('hit endpoint', login.name);
  const respond = rsp.init(res);

  try {
    const request = parse.loginRequest(req);
    if (request.error !== undefined) {
      console.error('admin login failed', request.error);
      respond.badRequest(request.error);
      return;
    }

    const { username, password } = request.result;

    const query = await db.query(sql.getAdminByUsername, [username]);
    if (query.error !== undefined) {
      console.error('admin login failed', query.error);
      respond.internalServerError();
      return;
    }

    const parsed = parse.loginResult(query.result);
    if (parsed.unauthorized) {
      console.log('wrong credentials', { username });
      respond.unauthorized('wrong credentials');
      return;
    }

    if (parsed.error !== undefined) {
      console.error('error creating admin on db', parsed.error);
      respond.internalServerError();
      return;
    }

    const { password_hash } = parsed.result;

    const passwordMatches = await compare(password, password_hash);
    if (!passwordMatches) {
      console.log('wrong password, admin login failed', { username });
      respond.unauthorized('wrong credentials');
      return;
    }

    const token = sign({ username }, jwt.secret, { expiresIn: '1h' });
    res.cookie('token', token);
    console.log('login successful');
    respond.noContent();
  }
  catch (error) {
    console.error('admin login failed', error);
    respond.internalServerError();
  }
};

const logout = (req: Request, res: Response & Cookie) => {
  const respond = rsp.init(res);
  console.log('logging out');
  res.clearCookie('token');
  respond.noContent();
};

export const addAuthEndpoints = (app: Express) => {
  app.post('/auth/login', login);
  app.post('/auth/logout', logout);
};
