import { Express } from 'express';
import { authenticate } from 'modules/auth';
import { Request, Response } from 'modules/core';
import { db } from 'modules/db';
import * as rsp from 'modules/respond';
import * as sql from './sql';

const getPeople = async (req: Request, res: Response) => {
  console.log('getting all people');

  const user = await authenticate(req, res);
  if (!user) return;

  const respond = rsp.init(res);

  try {
    const { rows } = await db.query(sql.get);
    respond.ok(rows);
  }
  catch (error) {
    console.error('getting all people failed', error);
    respond.internalServerError();
  }
};

/** add people endpoints */
export const addPeople = (app: Express) => {
  app.get('/people', getPeople);
};
