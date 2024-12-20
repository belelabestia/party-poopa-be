import * as sql from '$/sql';

const importQuery = sql.init(__dirname);

export const getAllEvents = importQuery('get-all-events');
export const createEvent = importQuery('create-event');
export const updateEvent = importQuery('update-event');
export const deleteEvent = importQuery('delete-event');
