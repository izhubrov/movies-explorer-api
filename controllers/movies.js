const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const readMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({}).populate(['owner']);
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

const createMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  try {
    const newMovie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    });
    const newMovieWithOwner = await newMovie.populate('owner').execPopulate();
    res.send(newMovieWithOwner);
  } catch (error) {
    next(error);
  }
};

const removeLikedMovie = async (req, res, next) => {
  try {
    const movieToRemove = await Movie.findById(req.params.movieId);

    if (!movieToRemove) throw new NotFoundError('Запрашиваемый фильм не найден');

    if (movieToRemove.owner._id.toHexString() !== req.user._id) {
      throw new ForbiddenError('Недостаточно прав');
    }

    await Movie.findByIdAndRemove(req.params.movieId);
    res.send({ message: 'Фильм исключен из списка понравившихся' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  readMovies,
  createMovie,
  removeLikedMovie,
};
