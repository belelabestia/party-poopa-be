import * as sql from '$/sql';

const importQuery = sql.init(__dirname);

export const getAllAdmins = importQuery('get-all-admins');
export const createAdmin = importQuery('create-admin');
export const updateAdminUsername = importQuery('update-admin-username');
export const updateAdminPassword = importQuery('update-admin-password');
export const deleteAdmin = importQuery('delete-admin');
