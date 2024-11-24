import { Express } from 'express';

/** dumb quick check entrypoint */
export const addHello = (app: Express) => {
  app.get('/hello', (req, res) => {
    res.send('Hello world!');
  });
};
