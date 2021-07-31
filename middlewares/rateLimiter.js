const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowsMs: 60 * 1000, // 1 minute
  max: 20,
  message: { message: 'Превышено допустимое число запросов к серверу' },
});

module.exports = limiter;
