import express from 'express';
import { addAuthEndpoints } from '@/auth';
import { startServer } from '$/server';
import { addMiddlewares } from '$/middleware';
import { addHelloEndpoints } from '@/hello';
import { addPeopleEndpoints } from '@/people';
import { addAdminEndpoints } from '@/admins';
import { addEventEndpoints } from '@/events';

const app = express();

addMiddlewares(app);
addHelloEndpoints(app);
addAuthEndpoints(app);
addAdminEndpoints(app);
addEventEndpoints(app);
addPeopleEndpoints(app);
startServer(app);
