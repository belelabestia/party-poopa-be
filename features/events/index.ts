import * as rsp from 'modules/respond';
import * as sql from './sql';
import * as err from 'modules/error';
import { hash } from 'bcryptjs';
import { Express } from 'express';
import { db } from 'modules/db';
import { Request, Response } from 'modules/server';
import { authenticate } from 'modules/auth';
import { isDateString } from 'modules/date';

const getAllEvents = async (req: Request, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  console.log('getting all events');

  try {
    const { rows } = await db.query(sql.getAllEvents);
    console.log('getting all events succeeded');
    respond.ok(rows);
  }
  catch (error) {
    console.error('error getting events', error);
    respond.internalServerError();
  }
};

type CreateBody = { name?: unknown, date?: unknown };

const createEvent = async (req: Request<void, CreateBody>, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  const { name, date } = req.body;

  if (!name) {
    console.log('missing name, rejecting event creation');
    respond.badRequest('name is required');
    return;
  }

  if (typeof name !== 'string') {
    console.log('wrong name format, rejecting event creation');
    respond.badRequest('name must be a string');
    return;
  }
  
  if (typeof date !== 'string') {
    console.log('wrong date format, rejecting event creation');
    respond.badRequest('date must be a string in the format YYYY-MM-DD');
    return;
  }

  if (!isDateString(date)) {
    console.log('invalid date format, rejecting event creation');
    respond.badRequest('date must be a valid date string in the format YYYY-MM-DD');
    return;
  }

  console.log('creating event', { name });

  try {
    const { rows: [{ id }] } = await db.query(sql.createEvent, [name, date]);
    console.log('event created successfully');
    respond.ok({ id });
  }
  catch (error) {
    console.error('error creating admin', error);
    respond.internalServerError();
  }
};

type UpdateBody = { id?: unknown, name?: unknown, date?: unknown };

const updateEvent = async (req: Request<'id', UpdateBody>, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  throw err.make('unimplemented');

  const respond = rsp.init(res);
  const { params: { id }, body } = req;

  // if (!username) {
  //   console.log('missing username, rejecting update');
  //   respond.badRequest('missing username');
  //   return;
  // }

  // if (typeof username !== 'string') {
  //   console.log('wrong username format, rejecting update');
  //   respond.badRequest('username must be a string');
  //   return;
  // }

  console.log('udpating username');

  try {
    // await db.query(sql.updateEvent, [id, username]);
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

const deleteAdmin = async (req: Request<'id'>, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  const { id } = req.params;
  console.log('deleting admin');

  try {
    await db.query(sql.deleteEvent, [id]);
    respond.noContent();
  }
  catch (error) {
    console.error('error deleting admin', error);
    respond.internalServerError();
  }
};

export const addEventEndpoints = (app: Express) => {
  app.get('/events', getAllEvents);
  app.post('/event', createEvent);
  app.put('/event/:id', updateEvent);
  app.delete('/event/:id', deleteAdmin);
};
