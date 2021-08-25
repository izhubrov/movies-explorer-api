const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const ConflictError = require('../errors/conflict-err');
const { randomString } = require('../utils/utils');

const { NODE_ENV, JWT_SECRET } = process.env;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) throw new UnauthorizedError('Неправильные почта или пароль');

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    } else {
      const token = jsonwebtoken.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : randomString,
        { expiresIn: '7d' },
      );
      res.status(200);
      if (NODE_ENV === 'production') {
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          domain: '.nomoredomains.monster',
          secure: true,
          sameSite: 'strict',
          path: '/',
        });
      } else {
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          sameSite: 'strict',
        });
      }
      res.send({ name: user.name, message: 'Вы успешно авторизованы!' });
    }
  } catch (error) {
    next(error);
  }
};

const signout = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { jwt } = req.cookies;

    let verifiedUser = null;

    if (!jwt) {
      throw new UnauthorizedError('C токеном что-то не так');
    }

    const user = await User.findOne({ email });

    if (!user) throw new NotFoundError('Пользователь с такой почтой не найден');

    jsonwebtoken.verify(
      jwt,
      NODE_ENV === 'production' ? JWT_SECRET : randomString,
      (err, decoded) => {
        if (err) {
          throw new UnauthorizedError('Необходима авторизация');
        }
        verifiedUser = decoded;

        if (user._id.toHexString() !== verifiedUser._id) {
          throw new UnauthorizedError('Необходима авторизация');
        }
      },
    );
    res.status(200);
    if (NODE_ENV === 'production') {
      res.clearCookie('jwt', {
        httpOnly: true,
        domain: '.nomoredomains.monster',
        secure: true,
        sameSite: 'strict',
        path: '/',
      });
    } else {
      res.clearCookie('jwt', { sameSite: 'strict' });
    }
    res.send({ message: 'Вы успешно вышли из системы!' });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
    });

    res.send({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    let err = error;
    const { name, code } = err;
    if (name === 'MongoError' && code === 11000) {
      err = new ConflictError('Пользователь с такой почтой уже существует');
    }
    next(err);
  }
};

const readCurrentUserInfo = async (req, res, next) => {
  const { user } = req;
  try {
    const foundUser = await User.findById(user._id);
    if (!foundUser) throw new NotFoundError('Текущий пользователь не найден');
    res.send(foundUser);
  } catch (error) {
    next(error);
  }
};

const setUserInfo = async (req, res, next) => {
  let { email: newEmail, name: newName } = req.body;
  const id = req.user._id;
  try {
    // проверим, существует ли пользователь и
    // если какие-либо поля Имя или О себе не пераданы, берем их из существующего пользователя
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('Текущий пользователь не найден');

    newName = newName || user.name;
    newEmail = newEmail || user.email;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name: newName, email: newEmail },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    );

    res.send(updatedUser);
  } catch (error) {
    let err = error;
    const { name, code } = err;
    if (name === 'MongoError' && code === 11000) {
      err = new ConflictError('Пользователь с такой почтой уже существует');
    }
    next(err);
  }
};

module.exports = {
  login,
  signout,
  readCurrentUserInfo,
  createUser,
  setUserInfo,
};
