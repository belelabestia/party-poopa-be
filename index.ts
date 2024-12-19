import express from 'express';
import { addAuthEndpoints } from 'routes/auth';
import { startServer } from 'modules/server';
import { addMiddlewares } from 'modules/middleware';
import { addHelloEndpoints } from 'routes/hello';
import { addPeopleEndpoints } from 'routes/people';
import { addAdminEndpoints } from 'routes/admins';

const app = express();

addMiddlewares(app);
addHelloEndpoints(app);
addAuthEndpoints(app);
addAdminEndpoints(app);
addPeopleEndpoints(app);
startServer(app);
