import * as parse from '$/parse';
import { Request } from '$/server';
import { QueryResult } from 'pg';

export const getAllEventsResult = (result: QueryResult) => {
  const events = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = parse.object({ value: result.rows[i] });

    const id = row.property('id').number().greaterThanZero();
    if (id.error !== undefined) return { error: id.error };

    const name = row.property('name').string().nonEmpty();
    if (name.error !== undefined) return { error: name.error };

    const dateProp = row.property('date');

    if (dateProp.error !== undefined) {
      events.push({ id: id.value, name: name.value });
      continue;
    }

    const date = parse.string(dateProp).date();
    if (date.error !== undefined) return { error: date.error };

    events.push({ id: id.value, name: name.value, date: date.value });
  }

  return { events };
};

export const createEventRequest = (req: Request) => {
  const body = parse.object({ value: req.body });

  const name = body.property('name').string().nonEmpty();
  if (name.error !== undefined) return { error: name.error };

  const date = body.property('date').string().date();
  if (date.error !== undefined) return { error: date.error };

  return { data: { name: name.value, date: date.value } };
};

export const createEventResult = (result: QueryResult) => {
  const id = parse.array({ value: result.rows }).single().object().property('id').number().greaterThanZero();
  if (id.error !== undefined) return { error: id.error };

  return { id: id.value };
};

export const updateEventRequest = (req: Request) => {
  const id = parse.number({ value: Number(req.params.id) }).greaterThanZero();
  if (id.error !== undefined) return { error: id.error };

  const body = parse.object({ value: req.body });

  const name = body.property('name').string().nonEmpty();
  if (name.error !== undefined) return { error: name.error };

  const date = body.property('date').string().date();
  if (date.error !== undefined) return { error: date.error };

  return { data: { id: id.value, name: name.value, date: date.value } };
};

export const deleteEventRequest = (req: Request) => {
  const id = parse.number({ value: Number(req.params.id) }).greaterThanZero();
  if (id.error !== undefined) return { error: id.error };

  return { id };
};
