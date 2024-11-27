import * as sql from 'modules/sql';

const importQuery = sql.init(__dirname);

export const selectAll = importQuery('select-all');
export const insert = importQuery('insert');
export const update = importQuery('update');
export const $delete = importQuery('delete');
