import * as auth from 'routes/auth/client';
import * as people from 'routes/people/client';

const base = 'http://localhost:3000';

const run = async () => {
  const { cookies } = await auth.login(base, { username: 'dev', password: 'ICAVAGIaTVIL' });

  if (!cookies) {
    console.log('authentication failed');
    return;
  }

  console.log('acquired auth cookies', cookies);

  const $1 = await people.getAllPeople(base, cookies);
  if ($1.error) return;
  console.log('got all people', $1.people);

  const $2 = await people.addPerson(base, { lala: 'lele' }, cookies);
  if ($2.error) return;
  console.log('added person', $2.id);

  const $3 = await people.getAllPeople(base, cookies);
  if ($3.error) return;
  console.log('got all people', $3.people);

  const $4 = await people.updatePerson(base, $2.id, null, cookies);
  if ($4) return;
  console.log('updated person');

  const $5 = await people.getAllPeople(base, cookies);
  if ($5.error) return;
  console.log('got all people', $5.people);

  const $6 = await people.deletePerson(base, $2.id, cookies);
  if ($6) return;
  console.log('deleted person');

  const $7 = await people.getAllPeople(base, cookies);
  if ($7.error) return;
  console.log('get all people', $7.people);
};

run().then(() => process.exit(0));
