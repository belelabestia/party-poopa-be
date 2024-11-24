import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello world!');
});

const port = 3000;

const onStartup = () => {
  console.log('Party Poopa backend service started.');
  console.log(`Listening on port: ${port}.`);
};

app.listen(port, onStartup);
