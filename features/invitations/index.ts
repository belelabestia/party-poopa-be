import { Express } from 'express';
import { Request, Response } from '$/server';
import { authenticate } from '$/auth';
import * as rsp from '$/respond';
import * as sql from './sql';
import * as parse from './parse';
import * as db from '$/db';

const createInvitation = async (req: Request, res: Response) => {
  console.log('hit endpoint', createInvitation.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('invalid token');
      return;
    }

    const request = parse.createInvitationRequest(req);
    if (request.error) {
      console.error('parsing request failed', request.error);
      respond.badRequest(request.error.name);
      return;
    }

    const { eventId, personId } = request.invitation;

    const query = await db.query(sql.createInvitation, [eventId, personId]);
    if (query.error) {
      console.error('creating invitation on db failed', query.error);
      respond.internalServerError();
      return;
    }

    const parsed = parse.createInvitationResult(query.result);
    if (parsed.error) {
      console.error('creating invitation on db failed', parsed.error);
      respond.internalServerError();
      return;
    }

    console.log('invitation created successfully', { eventId });
    respond.ok({ id: parsed.id });
  }
  catch (error) {
    console.error('error creating invitation', error);
    respond.internalServerError();
  }
};

const deleteInvitation = async (req: Request, res: Response) => {
  console.log('hit endpoint', deleteInvitation.name);
  const respond = rsp.init(res);

  try {
    const auth = await authenticate(req);
    if (auth.error) {
      console.error('authentication failed', auth.error);
      respond.unauthorized('');
      return;
    }

    const request = parse.deleteInvitationRequest(req);
    if (request.error) {
      console.error('error parsing request', request.error);
      respond.badRequest(request.error.name);
      return;
    }

    const { id } = request;

    const query = await db.query(sql.deleteInvitation, [id]);
    if (query.error) {
      console.error('updating invitation on db failed', query.error);
      respond.internalServerError();
      return;
    }

    console.log('deleted invitation', { id });
    respond.noContent();
  }
  catch (error) {
    console.error('deleting invitation failed', error);
    respond.internalServerError();
  }
};

export const addInvitationEndpoints = (app: Express) => {
  app.post('/invitation', createInvitation);
  app.delete('/invitation/:id', deleteInvitation);
};
