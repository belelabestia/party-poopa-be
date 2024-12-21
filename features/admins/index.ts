import * as rsp from '$/respond';
import * as sql from './sql';
import * as parse from './parse';
import { hash } from 'bcryptjs';
import { Express } from 'express';
import { db } from '$/db';
import { Request, Response } from '$/server';
import { authenticate } from '$/auth';

const getAllAdmins = async (req: Request, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  console.log('getting all admins');

  try {
    const result = await db.query(sql.getAllAdmins);

    const admins = parse.getAllAdminsResult(result, respond);
    if (!admins) return;

    console.log('getting all admins succeeded');
    respond.ok(admins);
  }
  catch (error) {
    console.error('error getting admins', error);
    respond.internalServerError();
  }
};

const createAdmin = async (req: Request, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);

  const data = parse.createAdminRequest(req, respond);
  if (!data) return;

  const { username, password } = data;

  console.log('creating admin', { username });

  try {
    const hashed = await hash(password, 10);
    const result = await db.query(sql.createAdmin, [username, hashed]);

    const id = parse.createAdminResult(result, respond);
    if (!id) return;

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
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);

  const data = parse.updateAdminUsernameRequest(req, respond);
  if (!data) return;

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
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);

  const data = parse.updateAdminPassword(req, respond);
  if (!data) return;

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

  const data = parse.deleteAdmin(req, respond);
  if (!data) return;

  const { id } = data;

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
