import * as auth from 'routes/auth/client';
import * as people from 'routes/people/client';

const base = 'http://localhost:3000';

const run = async () => {
  const { error: authError, cookies } = await auth.login({ username: '', password: '' }, base);
  if (authError) return;

  const { error: peopleError, people: $people } = await people.getAllPeople(cookies, base);
  if (peopleError) return;

  console.log($people);
};

run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
