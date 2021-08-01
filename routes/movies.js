const router = require('express').Router();
const {
  readMovies, saveMovie, deleteSavedMovie,
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
}), saveMovie);
router.delete('/:movieId', celebrateValidation({ params: { id: null } }), deleteSavedMovie);

module.exports = router;
