const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка на стороне сервера' }));
};
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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
      }
    });
};
module.exports.updateUser = (req, res) => {
  if (req.user._id) {
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
  } else {
    res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
  }
};
module.exports.updateAvatar = (req, res) => {
  const avatar = req.body;
  if (avatar) {
    if (req.user._id) {
      User.findByIdAndUpdate(req.user._id, avatar, { new: 'true', runValidators: true })
        .then((user) => res.send(user))
        .catch(() => res.status(500).send({ message: 'Произошла ошибка на стороне сервера' }));
    } else {
      res.status(404).send({ message: 'Пользователь с указанным _id не найден' });
    }
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
  }
};
