import { Response } from 'modules/core';

export const init = (res: Response) => ({
  /** send a 'bad request' (400) response with a message */
  badRequest: (message: string) => res.status(400).json({ message }),

  /** send a 'created' (201) response with a message */
  created: (message: string) => res.status(201).json({ message }),

  /** send an 'internal server error' (500) response */
  internalServerError: () => res.status(500).json({ message: 'Internal server error' }),

  /** send an 'ok' (200) response with a payload */
  ok: (data: object) => res.status(200).json(data),

  /** send an 'unauthorized' (401) response with a message */
  unauthorized: (message: string) => res.status(401).json({ message })
});
