const User = require('../models/user');
const bcrypt = require('bcryptjs');
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на стороне сервера' }));
};
module.exports.getMe = (req, res) => {
  User.findOne(req.user)
  .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
    });
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password, } = req.body;
  bcrypt.hash(req.body.password, 10)
  .then(hash => User.create({ name, about, avatar, email, password: hash, }))
    .then((user) => res.status(201).send({ 
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
     }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};
module.exports.updateAvatar = (req, res) => {
  const avatar = req.body;
  User.findByIdAndUpdate(req.user._id, avatar, { new: 'true', runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};
