const { celebrate, Joi } = require('celebrate');
const { urlRegExp, passwordRegExp } = require('../utils/utils');
const errorMessages = require('../utils/celebrateErrorMessages');

const {
  general, required, email, password, id, text, url,
} = errorMessages;

const items = {
  email: Joi.string().trim().label('Почта').email()
    .required()
    .messages({ ...general, ...required, ...email }),
  password: Joi.string().trim().label('Пароль').required()
    .pattern(new RegExp(passwordRegExp))
    .messages({ ...general, ...required, ...password }),
  userId: Joi.string().trim().label('ID Пользователя').hex()
    .length(24)
    .messages({ ...general, ...id }),
  name: Joi.string().trim().label('Имя').min(2)
    .max(30)
    .messages({ ...general, ...text }),
  about: Joi.string().trim().label('О себе').min(2)
    .max(30)
    .messages({ ...general, ...text }),
  avatar: Joi.string().trim().label('Ссылка на Аватар').pattern(new RegExp(urlRegExp))
    .messages({ ...general, ...url }),
  link: Joi.string().trim().label('Ссылка на Изображение').required()
    .pattern(new RegExp(urlRegExp))
    .messages({ ...general, ...url }),
  cardId: Joi.string().trim().label('ID Карточки').hex()
    .length(24)
    .messages({ ...general, ...id }),
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
