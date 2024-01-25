const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch(next);
};
module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      if (`${card.owner}` !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить карточку другого пользователя');
      }
      Card.findByIdAndDelete(req.params.cardId)
        .orFail(new NotFoundError('Карточка с указанным _id не найдена'))
        .then(() => {
          res.send({ message: 'успешно' });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('Карточка с указанным _id не найдена'))
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};
