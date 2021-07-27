const router = require('express').Router();
const {
  readCards, createCard, removeCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const celebrateValidation = require('../helpers/celebrateValidation');

router.get('/', readCards);
router.post('/', celebrateValidation({ body: { name: null, link: null } }), createCard);
router.delete('/:cardId', celebrateValidation({ params: { cardId: null } }), removeCard);
router.put('/:cardId/likes', celebrateValidation({ params: { cardId: null } }), likeCard);
router.delete('/:cardId/likes', celebrateValidation({ params: { cardId: null } }), dislikeCard);

module.exports = router;
