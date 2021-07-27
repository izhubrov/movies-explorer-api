const mongoSettings = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const mongoUrl = 'mongodb://localhost:27017/mestodb';

const corsOptions = {
  origin: [
    'https://izhubrov-mesto.nomoredomains.club',
    'http://localhost:3000',
    'https://web.postman.co',
  ],
  credentials: true,
};

const randomString = 'some-secret-key';

const urlRegExp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\-a-zA-Z0-9\(\)@:%_\+\.~#?&\/=;,*'$!@\[\]]*)/;
const passwordRegExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/;

module.exports = {
  mongoSettings,
  mongoUrl,
  corsOptions,
  randomString,
  urlRegExp,
  passwordRegExp,
};
