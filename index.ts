import express from 'express';
import { addAuthEndpoints } from './features/auth';
import { startServer } from 'modules/server';
import { addMiddlewares } from 'modules/middleware';
import { addHelloEndpoints } from './features/hello';
import { addPeopleEndpoints } from './features/people';
import { addAdminEndpoints } from './features/admins';

const app = express();

addMiddlewares(app);
addHelloEndpoints(app);
addAuthEndpoints(app);
addAdminEndpoints(app);
addPeopleEndpoints(app);
startServer(app);
