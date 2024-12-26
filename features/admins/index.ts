import { hash } from 'bcryptjs';
import { Express } from 'express';
import { Request, Response } from '$/server';
import { authenticate } from '$/auth';
import * as rsp from '$/respond';
import * as db from '$/db';
import * as parse from './parse';
import * as sql from './sql';

const getAllAdmins = async (req: Request, res: Response) => {
  console.log('hit endpoint', getAllAdmins.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('invalid token');
      return;
    }

    const query = await db.query(sql.getAllAdmins);
    if (query.error) {
      console.error('getting all admins from db failed', query.error);
      respond.internalServerError();
      return;
    }

    const parsed = parse.getAllAdminsResult(query.result);
    if (parsed.error) {
      console.error('parsing admins from db failed', parsed.error);
      respond.internalServerError();
      return;
    }

    console.log('got all admins');
    respond.ok(parsed.admins);
  }
  catch (error) {
    console.error('error getting admins', error);
    respond.internalServerError();
  }
};

const createAdmin = async (req: Request, res: Response) => {
  console.log('hit endpoint', createAdmin.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('invalid token');
      return;
    }

    const request = parse.createAdminRequest(req);
    if (request.error) {
      console.error('error parsing request', request.error);
      respond.badRequest(request.error.name);
      return;
    }

    const { username, password } = request.result;
    const hashed = await hash(password, 10);
    const query = await db.query(sql.createAdmin, [username, hashed]);
    const constraint = parse.constraint(query.error);

    if (constraint.value === 'admins_username_key') {
      console.log('duplicate admin username', { username });
      respond.badRequest('duplicate username');
      return;
    }

    if (query.error) {
      console.error('creating admin on db failed', query.error);
      respond.internalServerError();
      return;
    }

    const parsed = parse.createAdminResult(query.result);
    if (parsed.error) {
      console.error('error creating admin on db', parsed.error);
      respond.internalServerError();
      return;
    }

    console.log('created admin', { username });
    respond.ok({ id: parsed.id });
  }
  catch (error) {
    console.error('error creating admin', error);
    respond.internalServerError();
  }
};

const updateAdminUsername = async (req: Request, res: Response) => {
  console.log('hit endpoint', updateAdminUsername.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('');
      return;
    }

    const request = parse.updateAdminUsernameRequest(req);
    if (request.error) {
      console.error('error parsing request', request.error);
      respond.badRequest(request.error.name);
      return;
    }

    const { id, username } = request.admin;

    const query = await db.query(sql.updateAdminUsername, [id, username]);
    const constraint = parse.constraint(query.error);

    if (constraint.value === 'admins_username_key') {
      console.log('duplicate admin username', { username });
      respond.badRequest('duplicate username');
      return;
    }

    if (query.error) {
      console.error('updating admin on db failed', query.error);
      respond.internalServerError();
      return;
    }

    console.log('updated username', { username });
    respond.noContent();
  }
  catch (error) {
    console.error('updating username failed', error);
    respond.internalServerError();
  }
};

const updateAdminPassword = async (req: Request, res: Response) => {
  console.log('hit endpoint', updateAdminUsername.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('');
      return;
    }

    const request = parse.updateAdminPasswordRequest(req);
    if (request.error) {
      console.error('error parsing request', request.error);
      respond.badRequest(request.error.name);
      return;
    }

    const { id, password } = request.admin;

    const hashed = await hash(password, 10);
    const query = await db.query(sql.updateAdminPassword, [id, hashed]);
    if (query.error) {
      console.error('updating admin on db failed', query.error);
      respond.internalServerError();
      return;
    }

    console.log('updated password', { id });
    respond.noContent();
  }
  catch (error) {
    console.error('updating password failed', error);
    respond.internalServerError();
  }
};

const deleteAdmin = async (req: Request, res: Response) => {
  console.log('hit endpoint', deleteAdmin.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('');
      return;
    }


    const request = parse.deleteAdminRequest(req);
    if (request.error) {
      console.error('error parsing request', request.error);
      respond.badRequest(request.error.name);
      return;
    }

    const { id } = request;

    const query = await db.query(sql.deleteAdmin, [id]);
    if (query.error) {
      console.error('updating admin on db failed', query.error);
      respond.internalServerError();
      return;
    }

    console.log('deleted admin', { id });
    respond.noContent();
  }
  catch (error) {
    console.error('deleting admin failed', error);
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
