const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле "name" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: [true, 'Поле "about" должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный URL',
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
    minlength: 8,
  },
}, { versionKey: false });
module.exports = mongoose.model('user', userSchema);
