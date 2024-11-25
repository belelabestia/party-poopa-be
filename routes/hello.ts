import { Express } from 'express';

/** dumb quick health check entrypoint */
export const addHello = (app: Express) => {
  app.get('/hello', (req, res) => {
    res.send('Hello world!');
  });
};
