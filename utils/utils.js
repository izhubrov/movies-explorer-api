const mongoSettings = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const corsOptions = {
  // origin: [
  //   'https://izhubrov-mesto.nomoredomains.club',
  //   'http://localhost:3000',
  //   'https://web.postman.co',
  // ],
  origin: '*',
  credentials: true,
};

const randomString = 'some-secret-key';

const urlRegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\-a-zA-Z0-9\(\)@:%_\+\.~#?&\/=;,*'$!@\[\]]*)/;
const passwordRegExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;
const ruRegExp = /^[а-яА-ЯёЁ0-9\s\/&\^#\$@\~<>;\{}|\[\]\*\_=\\+()№:\-%"?!,.]+$/;
const engRegExp = /^[a-zA-Z0-9\s\/&\^#\$@\~<>;\{}|\[\]\*\_=\\+()№:\-%"?!,.]+$/;

module.exports = {
  mongoSettings,
  corsOptions,
  randomString,
  urlRegExp,
  passwordRegExp,
  ruRegExp,
  engRegExp,
};
