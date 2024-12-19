update admins
set password_hash = $2
where id = $1;
