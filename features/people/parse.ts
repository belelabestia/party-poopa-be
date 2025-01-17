import { makeFail } from '$/error';
import { Request } from '$/server';
import { QueryResult } from 'pg';
import * as parse from '$/parse';

const fail = makeFail('people parse error');

export const getAllPeopleResult = (result: QueryResult) => {
  const people = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = parse.object({ value: result.rows[i] });

    const id = row.property('id').defined().number().positive();
    if (id.error) return { error: fail(id.error) };

    const name = row.property('name').defined().string().nonEmpty();
    if (name.error) return { error: fail(name.error) };

    people.push({ id: id.value, name: name.value });
  }

  return { people };
};

export const createPersonRequest = (req: Request) => {
  const body = parse.object({ value: req.body });

  const name = body.property('name').defined().string().nonEmpty();
  if (name.error) return { error: fail(name.error) };

  return { person: { name: name.value } };
};

export const createPersonResult = (result: QueryResult) => {
  const id = parse.array({ value: result.rows }).single().object().property('id').defined().number().positive();
  if (id.error) return { error: fail(id.error) };

  return { id: id.value };
};

export const updatePersonRequest = (req: Request) => {
  const id = parse.number({ value: Number(req.params.id) }).positive();
  if (id.error) return { error: fail(id.error) };

  const body = parse.object({ value: req.body });

  const name = body.property('name').defined().string().nonEmpty();
  if (name.error) return { error: fail(name.error) };

  return { person: { id: id.value, name: name.value } };
};

export const deletePersonRequest = (req: Request) => {
  const id = parse.number({ value: Number(req.params.id) }).positive();
  if (id.error) return { error: fail(id.error) };

  return { id: id.value };
};
