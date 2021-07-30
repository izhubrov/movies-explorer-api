const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const readMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: { $in: req.user._id } });
    res.send(movies);
  } catch (error) {
    next(error);
  }
};

const createOrLikeExistedMovie = async (req, res, next) => {
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
    let newOrModifiedMovie = await Movie.findOne({ movieId }).select('+owner');

    if (!newOrModifiedMovie) {
      newOrModifiedMovie = await Movie.create({
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
    }
    await newOrModifiedMovie.owner.addToSet(userId);
    await newOrModifiedMovie.save();

    res.send(newOrModifiedMovie);
  } catch (error) {
    next(error);
  }
};

const dislikeMovie = async (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  try {
    const movieToDislike = await Movie.findOne({ movieId }).select('+owner');

    if (!movieToDislike) throw new NotFoundError('Запрашиваемый фильм не найден');

    if (!movieToDislike.owner.includes(req.user._id)) {
      throw new ForbiddenError('Недостаточно прав');
    }

    await movieToDislike.owner.pull(userId);
    await movieToDislike.save();
    if (movieToDislike.owner.length === 0) {
      await Movie.findByIdAndDelete(movieToDislike._id);
    }
    res.send({ message: 'Фильм исключен из списка понравившихся' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  readMovies,
  createOrLikeExistedMovie,
  dislikeMovie,
};
