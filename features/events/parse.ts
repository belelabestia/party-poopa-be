import * as rsp from '$/respond';
import { Request } from '$/server';
import { isDateString } from '$/date';
import { QueryResult } from 'pg';

type Respond = ReturnType<typeof rsp.init>;

type GetAllEventsResult = { id: number, name: string, date: string }[];

export const getAllEventsResult = (result: QueryResult, respond: Respond) => {
  const rows = result.rows as GetAllEventsResult;
  const events = [] as GetAllEventsResult;

  for (let i = 0; i < rows.length; i++) {
    const { id, name, date } = rows[i];

    if (typeof id !== 'number' || Number.isNaN(id) || id < 1) {
      console.log('wrong id format, getting all events failed');
      respond.internalServerError();
      return;
    }

    if (typeof name !== 'string' || !name) {
      console.log('wrong name format, getting all events failed');
      respond.internalServerError();
      return;
    }

    if (typeof date !== 'string' || !isDateString(date)) {
      console.log('wrong date format, getting all events failed');
      respond.internalServerError();
      return;
    }

    events.push({ id, name, date });
  }

  return events;
};

type CreateEventRequest = { name: string, date?: string };

export const createEventRequest = (req: Request, respond: Respond) => {
  if (!req.body || typeof req.body !== 'object') {
    console.log('missing body, rejecting event creation');
    respond.badRequest('body is required');
    return;
  }

  const { name, date } = req.body as CreateEventRequest;

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

  if (!date) return { name };

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

  return { name, date };
};

type CreateEventResult = { id: number };

export const createEventResult = (result: QueryResult, respond: Respond) => {
  const { id } = result.rows[0] as CreateEventResult;

  if (typeof id !== 'number' || Number.isNaN(id) || id < 1) {
    console.log('wrong id format, creating event failed');
    respond.internalServerError();
    return;
  }

  return id;
};

type UpdateEventRequest = { id: number, name: string, date?: string };

export const updateEventRequest = (req: Request, respond: Respond) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    console.log('wrong id format, rejecting event update');
    respond.badRequest('id must be a number');
    return;
  }

  if (!req.body || typeof req.body !== 'object') {
    console.log('missing body, rejecting event update');
    respond.badRequest('body is required');
    return;
  }

  const { name, date } = req.body as UpdateEventRequest;

  if (!name) {
    console.log('missing name, rejecting event update');
    respond.badRequest('name is required');
    return;
  }

  if (typeof name !== 'string') {
    console.log('wrong name format, rejecting event update');
    respond.badRequest('name must be a string');
    return;
  }

  if (!date) return { id, name };

  if (typeof date !== 'string') {
    console.log('wrong date format, rejecting event update');
    respond.badRequest('date must be a string in the format YYYY-MM-DD');
    return;
  }

  if (!isDateString(date)) {
    console.log('invalid date format, rejecting event update');
    respond.badRequest('date must be a valid date string in the format YYYY-MM-DD');
    return;
  }

  return { id, name, date };
};

export const deleteEventRequest = (req: Request, respond: Respond) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    console.log('wrong id format, rejecting event deletion');
    respond.badRequest('id must be a number');
    return;
  }

  return { id };
};
