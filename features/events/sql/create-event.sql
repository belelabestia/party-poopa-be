insert into events (name, date)
values ($1, $2)
returning id;
