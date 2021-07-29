const router = require('express').Router();
const {
  readMovies, createOrLikeExistedMovie, dislikeMovie,
} = require('../controllers/movies');
const celebrateValidation = require('../helpers/celebrateValidation');

router.get('/', readMovies);
router.post('/', celebrateValidation({
  body: {
    country: null,
    director: null,
    duration: null,
    year: null,
    description: null,
    image: null,
    trailer: null,
    nameRU: null,
    nameEN: null,
    thumbnail: null,
    movieId: null,
  },
}), createOrLikeExistedMovie);
router.delete('/:movieId', celebrateValidation({ params: { movieId: null } }), dislikeMovie);

module.exports = router;
