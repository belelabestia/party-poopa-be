import * as sql from 'modules/sql';

const importQuery = sql.init(__dirname);

export const getAdminByUsername = importQuery('get-admin-by-username');
