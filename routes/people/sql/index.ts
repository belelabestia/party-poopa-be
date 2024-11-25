import * as sql from 'modules/sql';

const importQuery = sql.init(__dirname);

export const get = importQuery('get');
