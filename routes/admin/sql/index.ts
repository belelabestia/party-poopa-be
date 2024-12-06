import * as sql from 'modules/sql';

const importQuery = sql.init(__dirname);

export const getAllAdmins = importQuery('get-all-admins');
export const createAdmin = importQuery('create-admin');
export const updateAdmin = importQuery('update-admin');
export const deleteAdmin = importQuery('delete-admin');
