import { Pool } from 'pg';
import * as config from 'config';

export const db = new Pool(config.db);
