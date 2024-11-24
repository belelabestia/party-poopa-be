import express from 'express';
import { db } from 'db';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/db', async (req, res) => {
  const data = await db.query('select * from admins');
  res.json(data.rows);
})

const port = 3000;

const onStartup = () => {
  console.log('Party Poopa backend service started.');
  console.log(`Listening on port: ${port}.`);
};

app.listen(port, onStartup);
