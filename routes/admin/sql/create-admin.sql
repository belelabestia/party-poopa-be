insert into admins (username, password_hash)
values ($1, $2)
returning id;
