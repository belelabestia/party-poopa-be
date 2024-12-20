import * as sql from '$/sql';

const importQuery = sql.init(__dirname);

export const getAllPeople = importQuery('get-all-people');
export const createPerson = importQuery('create-person');
export const updatePerson = importQuery('update-person');
export const deletePerson = importQuery('delete-person');
