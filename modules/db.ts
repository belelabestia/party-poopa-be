import { Pool } from 'pg';
import * as config from 'config';
import { makeFail } from './error';

const fail = makeFail('db error');

export const pool = new Pool(config.db);

export const query = async (text: string, values?: unknown[]) => {
  try {
    return { result: await pool.query(text, values) };
  }
  catch (error) {
    if (error === undefined) return { error: fail('pg threw undefined during query') };
    if (error === null) return { error: fail('pg threw null during query') };
    return { error: fail(error) };
  }
};
