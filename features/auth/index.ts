import * as rsp from '$/respond';
import * as sql from './sql';
import * as parse from './parse';
import { compare } from 'bcryptjs';
import { jwt } from 'config';
import { Express } from 'express';
import { sign } from 'jsonwebtoken';
import { db } from '$/db';
import { Request, Response } from '$/server';

type Cookie = {
  cookie: (name: string, token: string) => void,
  clearCookie: (name: string) => void
};

type Admin = { password_hash: string };

const login = async (req: Request, res: Response & Cookie) => {
  const respond = rsp.init(res);

  const data = parse.login(req, respond);
  if (!data) return;

  const { username, password } = data;

  console.log('logging admin in', { username });

  try {
    const { rows: [admin] } = await db.query<Admin>(sql.getAdminByUsername, [username]);

    if (!admin) {
      console.log('wrong username, admin login failed', { username });
      respond.unauthorized('wrong credentials');
      return;
    }

    const passwordMatches = await compare(password, admin.password_hash);

    if (!passwordMatches) {
      console.log('wrong password, admin login failed', { username });
      respond.unauthorized('wrong credentials');
      return;
    }

    const token = sign({ username }, jwt.secret, { expiresIn: '1h' });
    res.cookie('token', token);
    console.log('login successful');
    respond.ok({ message: 'login successful' });
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
