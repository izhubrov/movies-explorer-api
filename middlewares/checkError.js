const { isCelebrateError } = require('celebrate');
const errorMessages = require('../utils/celebrateErrorMessages');
const ValidationError = require('../errors/validation-err');

const checkError = (err, req, res, next) => {
  let error = err;
  const { code, message } = err;
  error.code = code || 500;
  error.message = error.code !== 500 ? message : 'Ошибка на стороне сервера';

  // Обработка ошибок Celebrate
  // Если в celebrate будут другие параметры кроме body, params, их необходимо добавить в errorItem
  if (isCelebrateError(error)) {
    const errorItem = err.details.get('body') || error.details.get('params');
    const additionalMessage = errorItem.message.split('"').join('');
    error = new ValidationError(`${errorMessages.incorrectData}${additionalMessage}`);
  }
  next(error);
};

module.exports = checkError;
