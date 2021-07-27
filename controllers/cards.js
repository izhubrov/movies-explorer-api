const Card = require('../models/card');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const readCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['likes', 'owner']).sort('-createdAt');
    res.send(cards);
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const newCard = await Card.create({ name, link, owner: req.user._id });
    const newCardWithOwner = await newCard.populate('owner').execPopulate();
    res.send(newCardWithOwner);
  } catch (error) {
    next(error);
  }
};

const removeCard = async (req, res, next) => {
  try {
    const cardToRemove = await Card.findById(req.params.cardId);

    if (!cardToRemove) throw new NotFoundError('Запрашиваемая карточка не найдена');

    if (cardToRemove.owner._id.toHexString() !== req.user._id) {
      throw new ForbiddenError('Недостаточно прав');
    }

    await Card.findByIdAndRemove(req.params.cardId);
    res.send({ message: 'Пост удалён' });
  } catch (error) {
    next(error);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const cardToLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .populate(['likes', 'owner']);

    if (!cardToLike) throw new NotFoundError('Запрашиваемая карточка не найдена');

    res.send(cardToLike);
  } catch (error) {
    next(error);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const cardToLike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .populate(['likes', 'owner']);

    if (!cardToLike) throw new NotFoundError('Запрашиваемая карточка не найдена');

    res.send(cardToLike);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  readCards,
  createCard,
  removeCard,
  likeCard,
  dislikeCard,
};
