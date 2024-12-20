import { Express } from 'express';
import { Json } from './json';

export type Request = {
  params: {},
  body: Body,
  cookies: unknown
};

export type Response = {
  status: (code: number) => Response,
  json: (data: Json) => void,
  end: () => void
};

const port = 3000;

const onStartup = () => {
  console.log('Party Poopa backend service started.');
  console.log(`Listening on port: ${port}.`);
};

export const startServer = (app: Express) => app.listen(port, onStartup);
