const errorMessages = {
  incorrectData: 'Переданы некорректные данные. ',
  string: {
    'string.base': 'Поле {#label} должно быть строкой',
    'string.empty': 'Поле {#label} не может быть пустым',
  },
  number: {
    'number.base': 'Поле {#label} должно быть числом',
    'number.integer': 'Поле {#label} не может дробным числом',
    'number.positive': 'Поле {#label} не может отрицательным',
  },
  required: {
    'any.required': 'Поле {#label} является обязательным',
  },
  email: {
    'string.email': 'Поле {#label} не соответствует шаблону почты',
  },
  password: {
    'string.pattern.base': 'Поле {#label} должно состоять из латинских букв, содержать как минимум 1 цифру, 1 спецсимвол, 1 прописную букву, 1 заглавную букву, длина от 8 символов.',
  },
  id: {
    'string.length': '{#label} должен состоять из 24 символов',
    'string.hex': '{#label} должен состоять из шестнадцатеричных символов',
  },
  text: {
    'string.min': 'Длина поля {#label} должна быть не менее 2 символов',
    'string.max': 'Длина поля {#label} должна быть не более 30 символов',
  },
  url: {
    'string.pattern.base': 'Поле {#label} не соответствует шаблону ссылки',
  },
  ru: {
    'string.pattern.base': 'Поле {#label} должно состоять из букв русского алфавита',
  },
  eng: {
    'string.pattern.base': 'Поле {#label} должно состоять из букв английского алфавита',
  },
};

module.exports = errorMessages;
