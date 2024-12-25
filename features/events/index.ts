import * as rsp from '$/respond';
import * as sql from './sql';
import * as parse from './parse';
import * as db from '$/db';
import { Express } from 'express';
import { Request, Response } from '$/server';
import { authenticate } from '$/auth';

const getAllEvents = async (req: Request, res: Response) => {
  console.log('hit endpoint', getAllEvents.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error !== undefined) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('invalid token');
      return;
    }

    const query = await db.query(sql.getAllEvents);
    if (query.error !== undefined) {
      console.error('getting all events from db failed', query.error);
      respond.internalServerError();
      return;
    }

    const parsed = parse.getAllEventsResult(query.result);
    if (parsed.error !== undefined) {
      console.error('parsing events from db failed', parsed.error);
      respond.internalServerError();
      return;
    }

    console.log('got all events');
    respond.ok(parsed.result);
  }
  catch (error) {
    console.error('error getting events', error);
    respond.internalServerError();
  }
};

const createEvent = async (req: Request, res: Response) => {
  console.log('hit endpoint', createEvent.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error !== undefined) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('invalid token');
      return;
    }

    const request = parse.createEventRequest(req);
    if (request.error !== undefined) {
      console.error('parsing request failed', request.error);
      respond.badRequest(request.error);
      return;
    }

    const { name, date } = request.result;

    const query = await db.query(sql.createEvent, [name, date]);
    if (query.error !== undefined) {
      console.error('creating event on db failed', query.error);
      respond.internalServerError();
      return;
    }

    const parsed = parse.createEventResult(query.result);
    if (parsed.error !== undefined) {
      console.error('creating event on db failed', parsed.error);
      respond.internalServerError();
      return;
    }

    console.log('event created successfully', { name });
    respond.ok({ id: parsed.result });
  }
  catch (error) {
    console.error('error creating admin', error);
    respond.internalServerError();
  }
};

const updateEvent = async (req: Request, res: Response) => {
  console.log('hit endpoint', updateEvent.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error !== undefined) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('');
      return;
    }

    const request = parse.updateEventRequest(req);
    if (request.error !== undefined) {
      console.error('error parsing request', request.error);
      respond.badRequest(request.error);
      return;
    }

    const { id, name, date } = request.result;

    const query = await db.query(sql.updateEvent, [id, name, date]);
    if (query.error !== undefined) {
      console.error('updating admin on db failed', query.error);
      respond.internalServerError();
      return;
    }

    console.log('updated event', { name });
    respond.noContent();
  }
  catch (error) {
    console.error('updating event failed', error);
    respond.internalServerError();
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  console.log('hit endpoint', deleteEvent.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error !== undefined) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('');
      return;
    }


    const request = parse.deleteEventRequest(req);
    if (request.error !== undefined) {
      console.error('error parsing request', request.error);
      respond.badRequest(request.error);
      return;
    }

    const { id } = request.result;

    const query = await db.query(sql.deleteEvent, [id]);
    if (query.error !== undefined) {
      console.error('updating event on db failed', query.error);
      respond.internalServerError();
      return;
    }

    console.log('deleted event', { id });
    respond.noContent();
  }
  catch (error) {
    console.error('deleting event failed', error);
    respond.internalServerError();
  }
};

export const addEventEndpoints = (app: Express) => {
  app.get('/events', getAllEvents);
  app.post('/event', createEvent);
  app.put('/event/:id', updateEvent);
  app.delete('/event/:id', deleteEvent);
};
