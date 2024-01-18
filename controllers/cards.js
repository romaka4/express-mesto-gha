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
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    });
};
module.exports.deleteCardById = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('NotValidId'))
      .then(() => {
        res.send({ message: 'Вы удалили карточку' });
      })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
        }
      });
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные для удаления карточки' });
  }
};

module.exports.likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(new Error('NotValidId'))
      .then((card) => {
        res.send(card);
      })
      .catch((err) => {
        if (err.message === 'NotValidId') {
          res.status(404).send({ message: 'Передан несуществующий _id карточки' });
        } else {
          res.status(500).send({ message: 'Ошибка на стороне сервера' });
        }
      });
  } else {
    res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
  }
};
module.exports.dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
} else {
  res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
}
};
