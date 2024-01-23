const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);
app.post('/signup', createUser);
app.post('/signin', login);
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
app.listen(PORT);
