const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getMe,
} = require('../controllers/users');

router.get('/me', getMe);
router.get('/', getUsers);
router.get('/:userId', getUserById);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
module.exports = router;
