import * as rsp from '$/respond';
import { Request } from '$/server';

type Respond = ReturnType<typeof rsp.init>;
type CreateBody = { username?: unknown, password?: unknown };

export const createAdmin = (req: Request, respond: Respond) => {
  if (!req.body || typeof req.body !== 'object') {
    console.log('missing body, rejecting event creation');
    respond.badRequest('body is required');
    return;
  }

  const { username, password } = req.body as CreateBody;

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

type UpdateUsernameBody = { username?: unknown };

export const updateAdminUsername = (req: Request, respond: Respond) => {
  if (!('id' in req.params) || typeof req.params.id !== 'string') {
    console.log('missing id, rejecting username update');
    respond.badRequest('id is required');
    return;
  }

  const { id } = req.params;

  if (!req.body || typeof req.body !== 'object') {
    console.log('missing body, rejecting username update');
    respond.badRequest('body is required');
    return;
  }

  const { username } = req.body as UpdateUsernameBody;

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

type UpdatePasswordBody = { password?: unknown };

export const updateAdminPassword = (req: Request, respond: Respond) => {
  if (!('id' in req.params) || typeof req.params.id !== 'string') {
    console.log('missing id, rejecting password update');
    respond.badRequest('id is required');
    return;
  }

  const { id } = req.params;

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
  if (!('id' in req.params) || typeof req.params.id !== 'string') {
    console.log('missing id, rejecting admin deletion');
    respond.badRequest('id is required');
    return;
  }

  return { id: req.params.id };
};
