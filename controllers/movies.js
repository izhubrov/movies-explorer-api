const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const readMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

const saveMovie = async (req, res, next) => {
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
  const userId = req.user._id;

  try {
    const savedMovie = await Movie.create({
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
      owner: userId,
    });
    res.send(savedMovie);
  } catch (error) {
    next(error);
  }
};

const deleteSavedMovie = async (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  try {
    const movieToRemove = await Movie.findOne({ movieId, owner: userId });

    if (!movieToRemove) throw new NotFoundError('Запрашиваемый фильм не найден');

    if (movieToRemove.owner.toHexString() !== userId) {
      throw new ForbiddenError('Недостаточно прав');
    }
    await movieToRemove.remove();
    res.send({ message: 'Фильм исключен из списка сохраненных' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  readMovies,
  saveMovie,
  deleteSavedMovie,
};
