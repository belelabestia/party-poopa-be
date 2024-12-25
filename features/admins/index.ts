import * as rsp from '$/respond';
import * as db from '$/db';
import * as parse from './parse';
import * as sql from './sql';
import { hash } from 'bcryptjs';
import { Express } from 'express';
import { Request, Response } from '$/server';
import { authenticate } from '$/auth';

const getAllAdmins = async (req: Request, res: Response) => {
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error !== undefined) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('wrong credentials');
      return;
    }

    const query = await db.query(sql.getAllAdmins);
    if (query.error !== undefined) {
      console.error('getting all admins from db failed', query.error);
      respond.internalServerError();
      return;
    }

    const parsed = parse.getAllAdminsResult(query.value);
    if (parsed.error !== undefined) {
      console.error('parsing admins from db failed', parsed.error);
      respond.internalServerError();
      return;
    }

    respond.ok(parsed.value);
  }
  catch (error) {
    console.error('error getting admins', error);
    respond.internalServerError();
  }
};

const createAdmin = async (req: Request, res: Response) => {
  const respond = rsp.init(res);

  const auth = await authenticate(req);
  if (auth.error !== undefined) {
    console.error('authentication failed', auth.error);
    respond.unauthorized('wrong credentials');
    return;
  }

  const { error, value: admin } = parse.createAdminRequest(req);
  if (error !== undefined) {
    console.error('rejecting admin creation', error);
    respond.badRequest(error);
    return;
  }

  console.log('creating admin on db', { username: admin.username });

  try {
    const hashed = await hash(admin.password, 10);
    const result = await db.query(sql.createAdmin, [username, hashed]);

    const { error, id } = parse.createAdminResult(result);

    if (error !== undefined) {
      console.error('error creating admin on db', error);
      respond.internalServerError();
      return;
    }

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

const updateAdminUsername = async (req: Request, res: Response) => {
  const admin = await authenticate(req);
  if (!admin) return;

  const respond = rsp.init(res);

  const { error, admin: data } = parse.updateAdminUsernameRequest(req);

  if (error !== undefined) {
    console.error('rejecting username update', error);
    respond.badRequest(error);
    return;
  }

  const { id, username } = data;

  console.log('updating username');

  try {
    await db.query(sql.updateAdminUsername, [id, username]);
    console.log('username updated successfully');
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

const updateAdminPassword = async (req: Request, res: Response) => {
  const admin = await authenticate(req);
  if (!admin) return;

  const respond = rsp.init(res);

  const { error, admin: data } = parse.updateAdminPasswordRequest(req);

  if (error !== undefined) {
    console.error('rejecting password update', error);
    respond.badRequest(error);
    return;
  }

  const { id, password } = data;

  console.log('udpating password');

  try {
    const hashed = await hash(password, 10);
    await db.query(sql.updateAdminPassword, [id, hashed]);
    console.log('password updated successfully');
    respond.noContent();
  }
  catch (error) {
    console.error('updating password failed', error);
    respond.internalServerError();
  }
};

const deleteAdmin = async (req: Request, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);

  const { error, id } = parse.deleteAdminRequest(req);

  if (error !== undefined) {
    console.error('rejecting admin deletion', error);
    respond.badRequest(error);
    return;
  }

  console.log('deleting admin');

  try {
    await db.query(sql.deleteAdmin, [id]);
    console.log('admin deleted successfully');
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
