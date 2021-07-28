require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { isCelebrateError } = require('celebrate');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { login, createUser, logout } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const ValidationError = require('./errors/validation-err');
const { mongoSettings } = require('./utils/utils');
const errorMessages = require('./utils/celebrateErrorMessages');
const celebrateValidation = require('./helpers/celebrateValidation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { NODE_ENV, PORT, DATABASE_URL } = process.env;
mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : 'mongodb://localhost:27017/mestodb', mongoSettings);

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
// app.use(cors(corsOptions));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', celebrateValidation({ body: { email: null, password: null } }), login);
app.post('/signup', celebrateValidation({ body: { email: null, password: null } }), createUser);
app.delete('/logout', logout);
app.use('/users', auth, usersRouter);
app.use('/movies', auth, moviesRouter);
app.use('*', (req, res, next) => {
  const error = new NotFoundError('Запрашиваемый ресурс не найден');
  next(error);
});

app.use(errorLogger);
app.use((err, req, res, next) => {
  // Если в celebrate будут другие параметры кроме body, params, их необходимо добавить в errorItem
  if (isCelebrateError(err)) {
    const errorItem = err.details.get('body') || err.details.get('params');
    const additionalMessage = errorItem.message.split('"').join('');
    const error = new ValidationError(`${errorMessages.incorrectData}${additionalMessage}`);
    next(error);
  }
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { code = 500, message, name } = err;
  if (name === 'MongoError' && code === 11000) {
    res.status(409).send({ message: 'Пользователь с такой почтой уже существует' });
  }
  res.status(code).send({ message: code === 500 ? 'Ошибка на стороне сервера' : message });
});

app.listen(NODE_ENV === 'production' ? PORT : 3001);
