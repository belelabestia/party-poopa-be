import { makeFail } from '$/error';
import { Request } from '$/server';
import { QueryResult } from 'pg';
import * as parse from '$/parse';

const fail = makeFail('events parse error');

export const getAllEventsResult = (result: QueryResult) => {
  const events = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = parse.object({ value: result.rows[i] });

    const id = row.property('id').defined().number().positive();
    if (id.error) return { error: fail(id.error) };

    const name = row.property('name').defined().string().nonEmpty();
    if (name.error) return { error: fail(name.error) };

    const _date = row.property('date');

    const dateProp = row.property('date').defined();
    const date = dateProp.error ? null : dateProp.date();
    if (date?.error) return { error: fail(date.error) };

    const peopleProp = row.property('people').defined();
    const people = peopleProp.error ? null : peopleProp.array();
    if (people?.error) return { error: fail(people.error) };

    events.push({ id: id.value, name: name.value, date: date?.value, people: people?.value });
  }

  return { events };
};

export const createEventRequest = (req: Request) => {
  const body = parse.object({ value: req.body });

  const name = body.property('name').defined().string().nonEmpty();
  if (name.error) return { error: fail(name.error) };

  const dateProp = body.property('date');
  if (dateProp.error) return { event: { name: name.value } };

  const date = dateProp.defined().string().date();
  if (date.error) return { error: fail(date.error) };

  return { event: { name: name.value, date: date.value } };
};

export const createEventResult = (result: QueryResult) => {
  const id = parse.array({ value: result.rows }).single().object().property('id').defined().number().positive();
  if (id.error) return { error: fail(id.error) };

  return { id: id.value };
};

export const updateEventRequest = (req: Request) => {
  const id = parse.number({ value: Number(req.params.id) }).positive();
  if (id.error) return { error: fail(id.error) };

  const body = parse.object({ value: req.body });

  const name = body.property('name').defined().string().nonEmpty();
  if (name.error) return { error: fail(name.error) };

  const date = body.property('date').defined().string().date();
  if (date.error) return { error: fail(date.error) };

  return { event: { id: id.value, name: name.value, date: date.value } };
};

export const deleteEventRequest = (req: Request) => {
  const id = parse.number({ value: Number(req.params.id) }).positive();
  if (id.error) return { error: fail(id.error) };

  return { id: id.value };
};
