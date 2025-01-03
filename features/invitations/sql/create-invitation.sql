insert into invitations (event_id, person_id)
values ($1, $2)
returning id;
