import * as rsp from '$/respond';
import { Request } from '$/server';
import { QueryResult } from 'pg';

type Respond = ReturnType<typeof rsp.init>;

type GetAllAdminsResult = { id: number, username: string }[];

export const getAllAdminsResult = (result: QueryResult, respond: Respond) => {
  const rows = result.rows as GetAllAdminsResult;
  const admins = [] as GetAllAdminsResult;

  for (let i = 0; i < rows.length; i++) {
    const { id, username } = rows[i];

    if (typeof id !== 'number' || Number.isNaN(id)) {
      console.log('wrong id format, getting all admins failed');
      respond.internalServerError();
      return;
    }

    if (typeof username !== 'string' || !username) {
      console.log('wrong username format, getting all admins failed');
      respond.internalServerError();
      return;
    }

    admins.push({ id, username });
  }

  return admins;
};

type CreateAdminRequest = { username: string, password: string };

export const createAdminRequest = (req: Request, respond: Respond) => {
  if (!req.body || typeof req.body !== 'object') {
    console.log('missing body, rejecting event creation');
    respond.badRequest('body is required');
    return;
  }

  const { username, password } = req.body as CreateAdminRequest;

  if (!username || !password) {
    console.log('missing username or password, rejecting admin creation');
    respond.badRequest('username and password are required');
    return;
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    console.log('wrong username or password format, rejecting admin creation');
    respond.badRequest('username and password must be strings');
    return;
  }

  return { username, password };
};

type CreateAdminResult = { id: number };

export const createAdminResult = (result: QueryResult, respond: Respond) => {
  const { id } = result.rows[0] as CreateAdminResult;

  if (typeof id !== 'number' || Number.isNaN(id) || id < 1) {
    console.log('wrong id format, creating admin failed');
    respond.internalServerError();
    return;
  }

  return id;
};

type UpdateUsernameRequest = { username: string };

export const updateAdminUsernameRequest = (req: Request, respond: Respond) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || id < 1) {
    console.log('wrong id format, rejecting username update');
    respond.badRequest('id must be a number');
    return;
  }

  if (!req.body || typeof req.body !== 'object') {
    console.log('missing body, rejecting username update');
    respond.badRequest('body is required');
    return;
  }

  const { username } = req.body as UpdateUsernameRequest;

  if (!username) {
    console.log('missing username, rejecting username update');
    respond.badRequest('username is required');
    return;
  }

  if (typeof username !== 'string') {
    console.log('wrong username format, rejecting username update');
    respond.badRequest('username must be a string');
    return;
  }

  return { id, username };
};

type UpdatePasswordBody = { password: string };

export const updateAdminPassword = (req: Request, respond: Respond) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    console.log('wrong id format, rejecting password update');
    respond.badRequest('id must be a number');
    return;
  }

  if (!req.body || typeof req.body !== 'object') {
    console.log('missing body, rejecting password update');
    respond.badRequest('body is required');
    return;
  }

  const { password } = req.body as UpdatePasswordBody;

  if (!password) {
    console.log('missing password, rejecting password update');
    respond.badRequest('password is required');
    return;
  }

  if (typeof password !== 'string') {
    console.log('wrong password format, rejecting password update');
    respond.badRequest('password must be a string');
    return;
  }

  return { id, password };
};

export const deleteAdmin = (req: Request, respond: Respond) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    console.log('wrong id format, rejecting admin deletion');
    respond.badRequest('id must be a number');
    return;
  }

  return { id };
};
