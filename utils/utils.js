const { NODE_ENV } = process.env;
const mongoSettings = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const corsOrigin = NODE_ENV === 'production'
  ? 'https://izhubrov-mov-explorer.nomoredomains.monster'
  : 'http://localhost:3000';

const corsOptions = {
  origin: [corsOrigin],
  credentials: true,
};

const mongoUrl = 'mongodb://localhost:27017/movies-explorerDB';

const randomString = 'some-secret-key';

const urlRegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=;,*'$!@[\]]*)/;
const passwordRegExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;
// const ruRegExp = /^[а-яА-ЯёЁ0-9\\s/&^#$@~<>;{}|[\]*_=+()№:\-%"?!,.]+$/;
// const engRegExp = /^[a-zA-Z0-9\\s/&^#$@~<>;{}|[\]*_=+()№:\-%"?!,.]+$/;

module.exports = {
  mongoSettings,
  corsOptions,
  mongoUrl,
  randomString,
  urlRegExp,
  passwordRegExp,
};
