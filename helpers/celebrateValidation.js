const { celebrate, Joi } = require('celebrate');
const {
  urlRegExp, passwordRegExp, ruRegExp, engRegExp,
} = require('../utils/utils');
const errorMessages = require('../utils/celebrateErrorMessages');

const {
  string, number, required, email, password, id, text, url,
} = errorMessages;

const items = {
  email: Joi.string().trim().label('Почта').email()
    .required()
    .messages({ ...string, ...required, ...email }),
  password: Joi.string().trim().label('Пароль').required()
    .pattern(new RegExp(passwordRegExp))
    .messages({ ...string, ...required, ...password }),
  name: Joi.string().trim().label('Имя').required()
    .min(2)
    .max(30)
    .messages({ ...string, ...required, ...text }),
  country: Joi.string().trim().label('Страна создания фильма').required()
    .messages({ ...string, ...required }),
  director: Joi.string().trim().label('Режиссер фильма').required()
    .messages({ ...string, ...required }),
  duration: Joi.number().label('Длительность фильма').required()
    .messages({ ...number, ...required }),
  year: Joi.string().trim().label('Год выпуска фильма').required()
    .messages({ ...string, ...required }),
  description: Joi.string().trim().label('Описание фильма').required()
    .messages({ ...string, ...required }),
  image: Joi.string().trim().label('Ссылка на постер к фильму')
    .required()
    .pattern(new RegExp(urlRegExp))
    .messages({ ...string, ...required, ...url }),
  trailer: Joi.string().trim().label('Ссылка на трейлер фильма')
    .required()
    .pattern(new RegExp(urlRegExp))
    .messages({ ...string, ...required, ...url }),
  thumbnail: Joi.string().trim().label('Миниатюрное изображение постера к фильму')
    .required()
    .pattern(new RegExp(urlRegExp))
    .messages({ ...string, ...required, ...url }),
  id: Joi.string().trim().label('ID')
    .hex()
    .length(24)
    .messages({ ...string, ...id }),
  movieId: Joi.number().label('ID фильма').required()
    .messages({ ...number, ...required }),
  nameRU: Joi.string().trim().label('Название фильма на русском языке').required()
    .messages({ ...string, ...required }),
  nameEN: Joi.string().trim().label('Название фильма на английском языке').required()
    .messages({ ...string, ...required }),
};

// Функция ниже конструирует нужный объект из параметров на входе и внутреннего объекта,
// содержащего поля из items
// На выходе получаем конструкцию вида, например:
// celebrate({
//   body: Joi.object().keys({
//     title: Joi.string().required().min(2).max(30),
//     text: Joi.string().required().min(2),
//   }),
// })
const celebrateValidation = (params) => {
  const res = {};

  Object.keys(params).forEach((param) => {
    let innerObj = {};

    Object.keys(params[param]).forEach((item) => {
      innerObj[item] = items[item];
    });
    res[param] = Joi.object().keys(innerObj).unknown(true);

    innerObj = null;
  });

  return celebrate(res);
};

module.exports = celebrateValidation;
