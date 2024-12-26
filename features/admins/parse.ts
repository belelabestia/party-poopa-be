import { makeFail } from '$/error';
import * as parse from '$/parse';
import { Request } from '$/server';
import { QueryResult } from 'pg';

const fail = makeFail('admins parse error');

export const getAllAdminsResult = (result: QueryResult) => {
  const admins = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = parse.object({ value: result.rows[i] });

    const id = row.property('id').number().greaterThanZero();
    if (id.error) return { error: fail(id.error) };

    const username = row.property('username').string().nonEmpty();
    if (username.error) return { error: fail(username.error) };

    admins.push({ id: id.value, username: username.value });
  }

  return { admins };
};

export const createAdminRequest = (req: Request) => {
  const body = parse.object({ value: req.body });

  const username = body.property('username').string().nonEmpty();
  if (username.error) return { error: fail(username.error) };

  const password = body.property('password').string().nonEmpty();
  if (password.error) return { error: fail(password.error) };

  return { result: { username: username.value, password: password.value } };
};

export const createAdminResult = (result: QueryResult) => {
  const id = parse.array({ value: result.rows }).single().object().property('id').number().greaterThanZero();
  if (id.error) return { error: fail(id.error) };

  return { id: id.value };
};

export const updateAdminUsernameRequest = (req: Request) => {
  const id = parse.number({ value: Number(req.params.id) }).greaterThanZero();
  if (id.error) return { error: fail(id.error) };

  const username = parse.object({ value: req.body }).property('username').string().nonEmpty();
  if (username.error) return { error: fail(username.error) };

  return { admin: { id: id.value, username: username.value } };
};

export const updateAdminPasswordRequest = (req: Request) => {
  const id = parse.number({ value: Number(req.params.id) }).greaterThanZero();
  if (id.error) return { error: fail(id.error) };

  const password = parse.object({ value: req.body }).property('password').string().nonEmpty();
  if (password.error) return { error: fail(password.error) };

  return { admin: { id: id.value, password: password.value } };
};

export const deleteAdminRequest = (req: Request) => {
  const id = parse.number({ value: Number(req.params.id) }).greaterThanZero();
  if (id.error) return { error: fail(id.error) };

  return { id: id.value };
};

export const constraint = (x: unknown) => parse.object({ value: x }).property('constraint').string().nonEmpty();
