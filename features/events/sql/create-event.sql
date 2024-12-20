insert into admins (name, date)
values ($1, $2)
returning id;
