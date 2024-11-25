import * as sql from 'modules/sql';

const importQuery = sql.init(__dirname);

export const register = importQuery('register');
export const login = importQuery('login');
