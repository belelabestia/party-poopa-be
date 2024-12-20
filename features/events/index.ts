import * as rsp from '$/respond';
import * as sql from './sql';
import * as parse from './parse';
import { Express } from 'express';
import { db } from '$/db';
import { Request, Response } from '$/server';
import { authenticate } from '$/auth';

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

const createEvent = async (req: Request, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);

  const data = parse.createEvent(req, respond);
  if (!data) return;

  const { name, date } = data;

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

const updateEvent = async (req: Request, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  
  const data = parse.updateEvent(req, respond);
  if (!data) return;

  const { id, name, date } = data;

  console.log('udpating event', { name });

  try {
    await db.query(sql.updateEvent, [id, name, date]);
    respond.noContent();
  }
  catch (error) {
    console.error('updating event failed', error);
    respond.internalServerError();
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);

  const data = parse.deleteEvent(req, respond);
  if (!data) return;

  const { id } = data;

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
  app.delete('/event/:id', deleteEvent);

  app.post('', (req) => { req.cookies });
};
