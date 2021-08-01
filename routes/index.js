const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { login, createUser, signout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const celebrateValidation = require('../helpers/celebrateValidation');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
router.post('/signin', celebrateValidation({ body: { email: null, password: null } }), login);
router.post('/signup', celebrateValidation({ body: { email: null, password: null, name: null } }), createUser);
router.post('/signout', auth, celebrateValidation({ body: { email: null } }), signout);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);
router.use('*', auth, (req, res, next) => {
  const error = new NotFoundError('Запрашиваемый ресурс не найден');
  next(error);
});

module.exports = router;
