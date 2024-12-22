import { Request } from '$/server';
import { isDateString } from '$/date';
import { QueryResult } from 'pg';

export const getAllEventsResult = (result: QueryResult) => {
  const events = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows[i] as unknown;

    if (typeof row !== 'object') return { error: 'row should be an object' };
    if (!row) return { error: 'row should not be null' };

    if ('id' in row === false) return { error: 'missing id field' };
    const id = row.id;

    if (typeof id !== 'number') return { error: 'id should be a number' };
    if (Number.isNaN(id)) return { error: 'id should not be NaN' };
    if (id < 1) return { error: 'id should be greater than 0' };

    if ('name' in row === false) return { error: 'missing name field' };
    const name = row.name;

    if (typeof name !== 'string') return { error: 'name should be a string' };
    if (!name) return { error: 'name should not be empty' };

    if ('date' in row === false) {
      events.push({ id, name });
      continue;
    }

    const date = row.date;

    if (typeof date !== 'string') return { error: 'date should be a string' };
    if (!isDateString(date)) return { error: 'date should be a valid date string' };

    events.push({ id, name, date });
  }

  return { events };
};

export const createEventRequest = (req: Request) => {
  if (typeof req.body !== 'object') return { error: 'body should be an object' };
  if (!req.body) return { error: 'body should not be null' };

  if ('name' in req.body === false) return { error: 'missing name field' };
  const name = req.body.name;

  if (typeof name !== 'string') return { error: 'name should be a string' };
  if (!name) return { error: 'name should not be empty' };

  if ('date' in req.body === false) return { data: { name } };
  const date = req.body.date;

  if (typeof date !== 'string') return { error: 'date should be a string' };
  if (!isDateString(date)) return { error: 'date should be a valid date string in the format YYYY-MM-DD' };

  return { data: { name, date } };
};

export const createEventResult = (result: QueryResult) => {
  const rows = result.rows as unknown[];

  if (rows.length !== 1) return { error: 'result should be one row' };
  const row = rows[0];

  if (typeof row !== 'object') return { error: 'first row should be an object' };
  if (!row) return { error: 'first row should not be null' };

  if ('id' in row === false) return { error: 'missing id field' };
  const id = row.id;

  if (typeof id !== 'number') return { error: 'id should be a number' };
  if (Number.isNaN(id)) return { error: 'id should not be NaN' };
  if (id < 1) return { error: 'id should be greater than 0' };

  return { id };
};

export const updateEventRequest = (req: Request) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) return { error: 'id should be a number' };
  if (id < 1) return { error: 'id should be greater than 0' };

  if (typeof req.body !== 'object') return { error: 'body should be an object' };
  if (!req.body) return { error: 'body should not be null' };

  if ('name' in req.body === false) return { error: 'missing name field' };
  const name = req.body.name;

  if (typeof name !== 'string') return { error: 'name should be a string' };
  if (!name) return { error: 'name should not be empty' };

  if ('date' in req.body === false) return { data: { id, name } };
  const date = req.body.date;

  if (typeof date !== 'string') return { error: 'date should be a string' };
  if (!isDateString(date)) return { error: 'date should be a valid date string in the format YYYY-MM-DD' };

  return { data: { id, name, date } };
};

export const deleteEventRequest = (req: Request) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) return { error: 'id should be a number' };
  if (id < 1) return { error: 'id should be greater than 0' };

  return { id };
};
