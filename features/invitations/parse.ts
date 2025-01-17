import { makeFail } from '$/error';
import { Request } from '$/server';
import { QueryResult } from 'pg';
import * as parse from '$/parse';

const fail = makeFail('invitations parse error');

export const createInvitationRequest = (req: Request) => {
  const body = parse.object({ value: req.body });

  const eventId = body.property('event_id').defined().string().nonEmpty();
  if (eventId.error) return { error: fail(eventId.error) };

  const personId = body.property('person_id').defined().string().nonEmpty();
  if (personId.error) return { error: fail(personId.error) };

  return { invitation: { eventId: eventId.value, personId: personId.value } };
};

export const createInvitationResult = (result: QueryResult) => {
  const id = parse.array({ value: result.rows }).single().object().property('id').defined().number().positive();
  if (id.error) return { error: fail(id.error) };

  return { id: id.value };
};

export const deleteInvitationRequest = (req: Request) => {
  const id = parse.number({ value: Number(req.params.id) }).positive();
  if (id.error) return { error: fail(id.error) };

  return { id: id.value };
};
