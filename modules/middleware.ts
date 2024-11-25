import { Express } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

export const addMiddlewares = (app: Express) => {
  app.use(bodyParser.json());
  app.use(cookieParser());
};
