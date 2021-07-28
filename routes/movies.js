const router = require('express').Router();
const {
  readMovies, createMovie, removeLikedMovie,
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
}), createMovie);
router.delete('/:movieId', celebrateValidation({ params: { movieId: null } }), removeLikedMovie);

module.exports = router;
