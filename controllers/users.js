const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
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
      res.status(200).cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7, httpOnly: true, domain: '.nomoredomains.monster', secure: true, path: '/',
      })
        .send({ message: 'Вы успешно авторизованы!' });
    }
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { jwt } = req.cookies;

    let verifiedUser = null;

    if (!jwt) {
      throw new UnauthorizedError('C токеном что-то не так');
    }

    const user = await User.findOne({ email });

    if (!user) throw new NotFoundError('Пользователь с такой почтой не найден');

    jsonwebtoken.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : randomString, (err, decoded) => {
      if (err) {
        throw new UnauthorizedError('Необходима авторизация');
      }
      verifiedUser = decoded;

      if (user._id.toHexString() !== verifiedUser._id) {
        throw new UnauthorizedError('Необходима авторизация');
      }
    });
    res.status(200).clearCookie('jwt', {
      httpOnly: true, domain: '.nomoredomains.monster', secure: true, path: '/',
    })
      .send({ message: 'Вы успешно вышли из системы!' });
  } catch (error) {
    next(error);
  }
};

const readUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    next(error);
  }
};

const readUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) throw new NotFoundError('Запрашиваемый пользователь не найден');
    res.send(user);
  } catch (error) {
    next(error);
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

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, about, avatar, email, password: hash,
    });

    res.send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const setUserInfo = async (req, res, next) => {
  let { name: newName, about: newAbout } = req.body;
  const id = req.user._id;
  try {
    // проверим, существует ли пользователь и
    // если какие-либо поля Имя или О себе не пераданы, берем их из существующего пользователя
    const user = await User.findById(id);
    if (!user) throw new NotFoundError('Текущий пользователь не найден');
    newName = newName || user.name;
    newAbout = newAbout || user.about;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name: newName, about: newAbout },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    );

    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
};

const setUserAvatar = async (req, res, next) => {
  const { avatar: newAvatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: newAvatar },
      {
        new: true,
        runValidators: true,
        upsert: false,
      },
    );
    if (!user) throw new NotFoundError('Текущий пользователь не найден');
    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  readUsers,
  readUserInfo,
  readCurrentUserInfo,
  createUser,
  setUserInfo,
  setUserAvatar,
};
