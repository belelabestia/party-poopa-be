import { Express } from 'express';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'modules/json';
import { db } from 'modules/db';
import * as rsp from 'modules/respond';
import { jwt } from 'config';
import * as sql from './sql';

type Cookie = {
  cookie: (name: string, token: string, options: { httpOnly: true }) => void,
  clearCookie: (name: string) => void
};

type Admin = { password_hash: string };
type Credentials = { username: string, password: string };

const register = async (req: Request<void, Credentials>, res: Response) => {
  const { username, password } = req.body;
  const respond = rsp.init(res);

  console.log('registering admin', { username });

  if (!username || !password) {
    console.log('missing username or password, rejecting admin registration', { username });
    respond.badRequest('username and password are required');
    return;
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    console.log('username or password in wrong format, rejecting admin registration', { username });
    respond.badRequest('username and password must be strings');
    return;
  }

  try {
    const passwordHash = await hash(password, 10);
    await db.query(sql.register, [username, passwordHash]);
    console.log('admin registered successfully');
    respond.created('admin registered successfully');
  }
  catch (error) {
    console.error('error registering admin', error);
    respond.internalServerError();
  }
};

const login = async (req: Request<void, Credentials>, res: Response & Cookie) => {
  const { username, password } = req.body;
  const respond = rsp.init(res);

  console.log('logging admin in', { username });

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

  try {
    const { rows: [admin] } = await db.query<Admin>(sql.login, [username]);

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
    res.cookie('token', token, { httpOnly: true });
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

/** admin endpoints */
export const addAuth = (app: Express) => {
  app.post('/auth/register', register);
  app.post('/auth/login', login);
  app.post('/auth/logout', logout);
};
