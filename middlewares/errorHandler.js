const errorHandler = (err, req, res, next) => {
  const { code, message } = err;
  res.status(code).send({ message });
  next();
};

module.exports = errorHandler;
