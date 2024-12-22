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
  console.log('getting all events from db');

  try {
    const result = await db.query(sql.getAllEvents);
    const { error, events } = parse.getAllEventsResult(result);

    if (error !== undefined) {
      console.error('getting all events from db failed', error);
      respond.internalServerError();
      return;
    }

    console.log('getting all events succeeded');
    respond.ok(events);
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

  const { error, data } = parse.createEventRequest(req);

  if (error !== undefined) {
    console.error('rejecting event creation', error);
    respond.badRequest(error);
    return;
  }

  const { name, date } = data;

  console.log('creating event', { name });

  try {
    const result = await db.query(sql.createEvent, [name, date]);
    const { error, id } = parse.createEventResult(result);

    if (error !== undefined) {
      console.error('error creating event', error);
      respond.internalServerError();
      return;
    }

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

  const { error, data } = parse.updateEventRequest(req);

  if (error !== undefined) {
    console.error('rejecting event update', error);
    respond.badRequest(error);
    return;
  }

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

  const { error, id } = parse.deleteEventRequest(req);

  if (error !== undefined) {
    console.error('rejecting event deletion', error);
    respond.badRequest(error);
    return;
  }

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
};
