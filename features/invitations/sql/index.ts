import * as sql from '$/sql';

const importQuery = sql.init(__dirname);

export const createInvitation = importQuery('create-invitation');
export const deleteInvitation = importQuery('delete-invitation');
