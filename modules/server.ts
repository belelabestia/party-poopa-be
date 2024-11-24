import { Express } from 'express';

const port = 3000;

const onStartup = () => {
  console.log('Party Poopa backend service started.');
  console.log(`Listening on port: ${port}.`);
};

export const startServer = (app: Express) => app.listen(port, onStartup);
