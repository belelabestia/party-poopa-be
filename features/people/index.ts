import { Express } from 'express';
import { authenticate } from 'modules/auth';
import { Request, Response } from 'modules/server';
import { db } from 'modules/db';
import * as rsp from 'modules/respond';
import * as sql from './sql';

const getAllPeople = async (req: Request, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  console.log('getting all people');

  try {
    const { rows } = await db.query(sql.getAllPeople);
    console.log('getting all people succeded');
    respond.ok(rows);
  }
  catch (error) {
    console.error('getting all people failed', error);
    respond.internalServerError();
  }
};

const createPerson = async (req: Request, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  const data = req.body;
  console.log('create person');

  try {
    const { rows: [{ id }] } = await db.query(sql.createPerson, [data]);
    console.log('crating person succeded');
    respond.ok({ id });
  }
  catch (error) {
    console.error('creating person failed', error);
    respond.internalServerError();
  }
};

const updatePerson = async (req: Request<'id'>, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  const { params: { id }, body: data } = req;
  console.log('updating person');

  try {
    await db.query(sql.updatePerson, [id, data]);
    console.log('updating person succeded');
    respond.noContent();
  }
  catch (error) {
    console.error('updating person failed', error);
    respond.internalServerError();
  }
};

const deletePerson = async (req: Request<'id'>, res: Response) => {
  const admin = await authenticate(req, res);
  if (!admin) return;

  const respond = rsp.init(res);
  const { params: { id } } = req;
  console.log('deleting person');

  try {
    await db.query(sql.deletePerson, [id]);
    console.log('deleting person succeded');
    respond.noContent();
  }
  catch (error) {
    console.error('deleting person failed', error);
    respond.internalServerError();
  }
};

export const addPeopleEndpoints = (app: Express) => {
  app.get('/people', getAllPeople);
  app.post('/people', createPerson);
  app.put('/people/:id', updatePerson);
  app.delete('/people/:id', deletePerson);
};
