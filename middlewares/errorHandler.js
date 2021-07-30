const { isCelebrateError } = require('celebrate');
const errorMessages = require('../utils/celebrateErrorMessages');
const ValidationError = require('../errors/validation-err');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Обработка ошибок Celebrate
  // Если в celebrate будут другие параметры кроме body, params, их необходимо добавить в errorItem

  if (isCelebrateError(err)) {
    const errorItem = err.details.get('body') || err.details.get('params');
    const additionalMessage = errorItem.message.split('"').join('');
    // eslint-disable-next-line no-param-reassign
    err = new ValidationError(`${errorMessages.incorrectData}${additionalMessage}`);
  }

  const { code = 500, message, name } = err;
  if (name === 'MongoError' && code === 11000) {
    res.status(409).send({ message: 'Пользователь с такой почтой уже существует' });
  } else {
    res.status(code).send({ message: code === 500 ? 'Ошибка на стороне сервера' : message });
  }
};

module.exports = errorHandler;
