const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  User.findOne(req.user)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// module.exports.getUserById = (req, res) => {
//   console.log('oi');
//   User.findById(req.params.userId)
//     .orFail(new Error('NotValidId'))
//     .then((user) => {
//       res.send(user);
//     })
//     .catch((err) => {
//       if (err.message === 'NotValidId') {
//         res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
//       } else if (err.name === 'CastError') {
//         res.status(400).send({ message: 'Переданы некорректные данные' });
//       } else {
//         res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
//       }
//     });
// };
module.exports.getUserById = (req, res, next) => {
  console.log('oi');
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};
module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
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
  console.log(req);
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
// module.exports.login = (req, res) => {
//   console.log('1');
//   const { email, password } = req.body;
//   User.findOne({ email }).select('+password')
//     .then((user) => {
//       if (!user) {
//         console.log('Неправильные почта или пароль');
//       }
//       return bcrypt.compare(password, user.password);
//     })
//     .then((matched) => {
//       console.log('4');
//       if (!matched) {
//         console.log('Неправильные почта или пароль');
//       }
//       const token = jwt.sign({ _id: user._id }, 'super-strong-secret');
//       console.log('6');
//       res.status(200).send({ token });
//       console.log('7');
//     })
//     .catch((err) => {
//       console.log(err);
//       console.log('mes: ' + err.message);
//       res
//         .status(401)
//         .send({ message: err.message });
//     });
// }
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user._id);
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      console.log({token})
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.log(err);
      console.log(err.message);
      console.log(err.name);
      res.status(401).send({ message: err.message });
    });
};
