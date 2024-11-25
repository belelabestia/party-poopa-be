import { Express } from 'express';
import { authenticate } from 'modules/auth';
import { Request, Response } from 'modules/core';
import { db } from 'modules/db';
import * as rsp from 'modules/respond';
import * as sql from './sql';

const getAllPeople = async (req: Request, res: Response) => {
  console.log('getting all people');

  const user = await authenticate(req, res);
  if (!user) return;

  const respond = rsp.init(res);

  try {
    const { rows } = await db.query(sql.selectAll);
    respond.ok(rows);
  }
  catch (error) {
    console.error('getting all people failed', error);
    respond.internalServerError();
  }
};

const addPerson = async (req: Request, res: Response) => {
  console.log('adding person');

  const user = await authenticate(req, res);
  if (!user) return;

  const respond = rsp.init(res);
  
  const { data } = req.body;

  if (!data) {
    console.log('no person data, rejecting request');
    respond.badRequest('no person data');
    return;
  }

  try {
    await db.query(sql.insert, [data]);
    respond.noContent();
  }
  catch (error) {
    console.error('adding person failed', error);
    respond.internalServerError();
  }
};

/** add people endpoints */
export const addPeople = (app: Express) => {
  app.get('/people', getAllPeople);
  app.post('/people', addPerson);
};
