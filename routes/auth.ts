import { Express } from 'express';
import { compare, hash } from 'bcryptjs';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'modules/core';
import { db } from 'modules/db';
import * as rsp from 'modules/respond';
import * as sql from 'sql';
import { Admin } from 'modules/schema';
import { jwt } from 'config';

type Cookie = {
  cookie: (name: string, token: string, options: { httpOnly: true }) => void
};

const register = async (req: Request, res: Response) => {
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
    await db.query(sql.admin.register, [username, passwordHash]);
    respond.created('admin registered successfully');
  }
  catch (error) {
    console.error('error registering admin', error);
    respond.internalServerError();
  }
};

const login = async (req: Request, res: Response & Cookie) => {
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
    const { rows: [admin] } = await db.query<Admin>(sql.admin.login, [username]);

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

    respond.ok({ message: 'login successful' });
  }
  catch (error) {
    console.error('admin login failed', error);
    respond.internalServerError();
  }
}

/** admin endpoints */
export const addAdmin = (app: Express) => {
  app.post('/admin/register', register);
  app.post('/admin/login', login);
};
