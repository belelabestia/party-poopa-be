import { hash } from 'bcryptjs';
import { Express } from 'express';
import { db } from 'modules/db';
import { Request, Response } from 'modules/server';
import * as rsp from 'modules/respond';
import * as sql from './sql';
import { authenticate } from 'modules/auth';

const getAllAdmins = async (req: Request, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  console.log('getting all admins');

  try {
    const { rows } = await db.query(sql.getAllAdmins);
    console.log('getting all admins succeeded');
    respond.ok(rows);
  }
  catch (error) {
    console.error('error getting admins', error);
    respond.internalServerError();
  }
};

type CredentialsBody = { username?: unknown, password?: unknown };

const createAdmin = async (req: Request<void, CredentialsBody>, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  const { username, password } = req.body;

  if (!username || !password) {
    console.log('missing username or password, rejecting admin creation');
    respond.badRequest('username and password are required');
    return;
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    console.log('wrong username or password format, rejecting admin creation');
    respond.badRequest('username and password must be strings');
    return;
  }

  console.log('creating admin', { username });

  try {
    const hashed = await hash(password, 10);
    const { rows: [{ id }] } = await db.query(sql.createAdmin, [username, hashed]);
    console.log('admin created successfully');
    respond.ok({ id });
  }
  catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'constraint' in error &&
      error.constraint === 'admins_username_key'
    ) {
      console.log('duplicate username');
      respond.badRequest('duplicate username');
      return;
    }

    console.error('error creating admin', error);
    respond.internalServerError();
  }
};

type UsernameBody = { username?: unknown };

const updateAdminUsername = async (req: Request<'id', UsernameBody>, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  const { params: { id }, body: { username } } = req;

  if (!username) {
    console.log('missing username, rejecting update');
    respond.badRequest('missing username');
    return;
  }

  if (typeof username !== 'string') {
    console.log('wrong username format, rejecting update');
    respond.badRequest('username must be a string');
    return;
  }

  console.log('updating username');

  try {
    await db.query(sql.updateAdminUsername, [id, username]);
    respond.noContent();
  }
  catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'constraint' in error &&
      error.constraint === 'admins_username_key'
    ) {
      console.log('duplicate username');
      respond.badRequest('duplicate username');
      return;
    }

    console.error('updating username failed', error);
    respond.internalServerError();
  }
};

type PasswordBody = { password?: unknown };

const updateAdminPassword = async (req: Request<'id', PasswordBody>, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  const { params: { id }, body: { password } } = req;

  if (!password) {
    console.log('missing password, rejecting update');
    respond.badRequest('missing password');
    return;
  }

  if (typeof password !== 'string') {
    console.log('wrong password format, rejecting update');
    respond.badRequest('password must be a string');
    return;
  }

  console.log('udpating password');

  try {
    const hashed = await hash(password, 10);
    await db.query(sql.updateAdminPassword, [id, hashed]);
    respond.noContent();
  }
  catch (error) {
    console.error('updating password failed', error);
    respond.internalServerError();
  }
};

const deleteAdmin = async (req: Request<'id'>, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  const { id } = req.params;
  console.log('deleting admin');

  try {
    await db.query(sql.deleteAdmin, [id]);
    respond.noContent();
  }
  catch (error) {
    console.error('error deleting admin', error);
    respond.internalServerError();
  }
};

export const addAdminEndpoints = (app: Express) => {
  app.get('/admins', getAllAdmins);
  app.post('/admin', createAdmin);
  app.put('/admin/:id/username', updateAdminUsername);
  app.put('/admin/:id/password', updateAdminPassword);
  app.delete('/admin/:id', deleteAdmin);
};
