import { hash } from 'bcryptjs';
import { Express } from 'express';
import { db } from 'modules/db';
import { Request, Response } from 'modules/server';
import * as rsp from 'modules/respond';
import * as sql from './sql';
import { authenticate } from 'modules/auth';

type CreateBody = { username: string, password: string };
type UpdateBody = { username?: string, password?: string };

const getAllAdmins = async (req: Request, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  console.log('getting all admins');

  try {
    const { rows } = await db.query(sql.getAllAdmins);
    console.log('getting all admins succeded');
    respond.ok(rows);
  }
  catch (error) {
    console.error('error getting admins', error);
    respond.internalServerError();
  }
};

const createAdmin = async (req: Request<void, CreateBody>, res: Response) => {
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
    console.log('username or password in wrong format, rejecting admin creation');
    respond.badRequest('username and password must be strings');
    return;
  }

  console.log('creating admin', { username });

  try {
    const passwordHash = await hash(password, 10);
    const { rows: [{ id }] } = await db.query(sql.createAdmin, [username, passwordHash]);
    console.log('admin created successfully');
    respond.ok({ id });
  }
  catch (error) {
    console.error('error creating admin', error);
    respond.internalServerError();
  }
};

const updateAdmin = async (req: Request<'id', UpdateBody>, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  const { params: { id }, body: { username, password } } = req;

  if (
    (username && typeof username !== 'string') ||
    (password && typeof password !== 'string')
  ) {
    console.log('username or password in wrong format, rejecting admin update');
    respond.badRequest('username and password must be strings');
    return;
  }

  console.log('updating admin');

  try {
    const passwordHash = password && await hash(password, 10);
    await db.query(sql.updateAdmin, [username, passwordHash, id]);
    respond.noContent();
  }
  catch (error) {
    console.error('error updating admin');
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
    console.error('error updating admin');
    respond.internalServerError();
  }
};

export const addAdminEndpoints = (app: Express) => {
  app.get('/admin', getAllAdmins);
  app.post('/admin', createAdmin);
  app.put('/admin/:id', updateAdmin);
  app.delete('/admin/:id', deleteAdmin);
};
