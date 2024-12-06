update admins
set
  username = coalesce($1, username),
  password_hash = coalesce($2, password_hash)
where id = $3;
