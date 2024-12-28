import { Express } from 'express';
import { Request, Response } from '$/server';
import { authenticate } from '$/auth';
import * as rsp from '$/respond';
import * as sql from './sql';
import * as parse from './parse';
import * as db from '$/db';

const getAllPeople = async (req: Request, res: Response) => {
  console.log('hit endpoint', getAllPeople.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('invalid token');
      return;
    }

    const query = await db.query(sql.getAllPeople);
    if (query.error) {
      console.error('getting all people from db failed', query.error);
      respond.internalServerError();
      return;
    }

    const parsed = parse.getAllPeopleResult(query.result);
    if (parsed.error) {
      console.error('parsing people from db failed', parsed.error);
      respond.internalServerError();
      return;
    }

    console.log('got all people');
    respond.ok(parsed.people);
  }
  catch (error) {
    console.error('error getting people', error);
    respond.internalServerError();
  }
};

const createPerson = async (req: Request, res: Response) => {
  console.log('hit endpoint', createPerson.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('invalid token');
      return;
    }

    const request = parse.createPersonRequest(req);
    if (request.error) {
      console.error('parsing request failed', request.error);
      respond.badRequest(request.error.name);
      return;
    }

    const { name, date } = request.person;

    const query = await db.query(sql.createPerson, [name, date]);
    if (query.error) {
      console.error('creating person on db failed', query.error);
      respond.internalServerError();
      return;
    }

    const parsed = parse.createPersonResult(query.result);
    if (parsed.error) {
      console.error('creating person on db failed', parsed.error);
      respond.internalServerError();
      return;
    }

    console.log('person created successfully', { name });
    respond.ok({ id: parsed.id });
  }
  catch (error) {
    console.error('error creating person', error);
    respond.internalServerError();
  }
};

const updatePerson = async (req: Request, res: Response) => {
  console.log('hit endpoint', updatePerson.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('');
      return;
    }

    const request = parse.updatePersonRequest(req);
    if (request.error) {
      console.error('error parsing request', request.error);
      respond.badRequest(request.error.name);
      return;
    }

    const { id, name, date } = request.person;

    const query = await db.query(sql.updatePerson, [id, name, date]);
    if (query.error) {
      console.error('updating person on db failed', query.error);
      respond.internalServerError();
      return;
    }

    console.log('updated person', { name });
    respond.noContent();
  }
  catch (error) {
    console.error('updating person failed', error);
    respond.internalServerError();
  }
};

const deletePerson = async (req: Request, res: Response) => {
  console.log('hit endpoint', deletePerson.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('');
      return;
    }

    const request = parse.deletePersonRequest(req);
    if (request.error) {
      console.error('error parsing request', request.error);
      respond.badRequest(request.error.name);
      return;
    }

    const { id } = request;

    const query = await db.query(sql.deletePerson, [id]);
    if (query.error) {
      console.error('updating person on db failed', query.error);
      respond.internalServerError();
      return;
    }

    console.log('deleted person', { id });
    respond.noContent();
  }
  catch (error) {
    console.error('deleting person failed', error);
    respond.internalServerError();
  }
};

export const addPersonEndpoints = (app: Express) => {
  app.get('/people', getAllPeople);
  app.post('/person', createPerson);
  app.put('/person/:id', updatePerson);
  app.delete('/person/:id', deletePerson);
};
