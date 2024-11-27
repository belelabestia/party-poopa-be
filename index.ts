import express from 'express';
import { addAuth } from 'routes/auth';
import { startServer } from 'modules/server';
import { addMiddlewares } from 'modules/middleware';
import { addHello } from 'routes/hello';
import { addPeople } from 'routes/people';

const app = express();

addMiddlewares(app);
addHello(app);
addAuth(app);
addPeople(app);
startServer(app);
