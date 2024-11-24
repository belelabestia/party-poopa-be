import { Express } from 'express';
import bodyParser from 'body-parser';

export const addMiddlewares = (app: Express) => app.use(bodyParser.json());
