const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    });
};
module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => {
      res.send({ message: 'Вы удалили карточку' });
    })
    .catch(() => {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    });
};

module.exports.likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send(card);
    })
      .catch(() => {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      });
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные для постановки' });
  }
};
module.exports.dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send(card);
    })
      .catch(() => {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      });
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
  }
};
