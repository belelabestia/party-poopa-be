import * as rsp from '$/respond';
import { Request } from '$/server';
import { isDateString } from '$/date';

type Respond = ReturnType<typeof rsp.init>;
type CreateBody = { name?: unknown, date?: unknown };

export const createEvent = (req: Request, respond: Respond) => {
  if (!req.body || typeof req.body !== 'object') {
    console.log('missing body, rejecting event creation');
    respond.badRequest('body is required');
    return;
  }

  const { name, date } = req.body as CreateBody;

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

type UpdateBody = { id?: unknown, name?: unknown, date?: unknown };

export const updateEvent = (req: Request<'id'>, respond: Respond) => {
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

  const { name, date } = req.body as UpdateBody;

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

export const deleteEvent = (req: Request<'id'>, respond: Respond) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    console.log('wrong id format, rejecting username update');
    respond.badRequest('id must be a number');
    return;
  }

  return { id };
};
