const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.login = (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // return Promise.reject(new Error('Неправильные почта или пароль'));
        console.log('err');
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        // return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // аутентификация успешна
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
}