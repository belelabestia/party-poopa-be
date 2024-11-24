import { Express } from 'express';
import { compare, hash } from 'bcryptjs';
import { Req } from 'modules/core';
import { db } from 'modules/db';
import * as rsp from 'modules/respond';
import * as sql from 'sql';
import { Admin } from 'modules/schema';

const register = async (req: Req, res: rsp.Response) => {
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

const login = async (req: Req, res: rsp.Response) => {
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

    respond.ok({ username: admin.username });
  }
  catch (error) {
    console.error('admin login failed');
    respond.internalServerError();
  }
}

/** admin endpoints */
export const addAdmin = (app: Express) => {
  app.post('/admin/register', register);
  app.post('/admin/login', login);
};
