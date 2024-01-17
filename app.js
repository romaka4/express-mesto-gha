const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);
app.use((req, res, next) => {
  req.user = {
    _id: '65a42cdb0f1e71717498e6c3',
  };
  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
app.listen(PORT);
