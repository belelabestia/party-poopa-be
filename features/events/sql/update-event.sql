update events
set
  name = $2,
  date = coalesce($3, date)
where id = $1;
