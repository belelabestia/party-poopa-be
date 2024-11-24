import express from 'express';
import { addAdmin } from 'routes/admin';
import { startServer } from 'modules/server';
import { addMiddlewares } from 'modules/middleware';
import { addHello } from 'routes/hello';

const app = express();

addMiddlewares(app);
addHello(app);
addAdmin(app);
startServer(app);
