import { compare } from 'bcryptjs';
import { jwt } from 'config';
import { Express } from 'express';
import { sign } from 'jsonwebtoken';
import { db } from 'modules/db';
import * as rsp from 'modules/respond';
import { Request, Response } from 'modules/server';
import * as sql from './sql';

type Cookie = {
  cookie: (name: string, token: string) => void,
  clearCookie: (name: string) => void
};

type Admin = { password_hash: string };
type Credentials = { username: string, password: string };

const login = async (req: Request<void, Credentials>, res: Response & Cookie) => {
  const respond = rsp.init(res);
  const { username, password } = req.body;

  if (!username || !password) {
    console.log('missing username or password, rejecting admin login', { username });
    respond.badRequest('username and password are required');
    return;
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    console.log('username or password in wrong format, rejecting admin login', { username });
    respond.badRequest('username and password must be strings');
    return;
  }

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
