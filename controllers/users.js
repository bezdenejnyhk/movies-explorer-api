const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ConflictError, ValidationError, NotFoundError } = require('../errors');

const { JWT_SECRET, NODE_ENV } = process.env;
const {
  conflictErrorText,
  badRequestErrorText,
  notFoundErrorText,
} = require('../utils/constant');

// создание пользователя
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      email,
      password: hash,
    })
      .then((newUser) => res.status(201).send({
        name: newUser.name,
        email: newUser.email,
        _id: newUser._id,
      }))
      .catch((err) => {
        if (err.code === 11000) {
          next(
            new ConflictError(conflictErrorText),
          );
          return;
        }
        if (err.name === 'ValidationError') {
          next(new ValidationError(badRequestErrorText));
          return;
        }
        next(err);
      });
  })
    .catch(next);
};

// вход
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'JWT_SECRET',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch(next);
};

// получение моего пользователя
const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(notFoundErrorText));
        return;
      }
      res.send({ user });
    })
    .catch(next);
};

// изменение данных пользователя
const editProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError(notFoundErrorText));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(conflictErrorText));
        return;
      } if (err.name === 'ValidationError') {
        next(new ValidationError(badRequestErrorText));
        return;
      }
      next(err);
    });
};

module.exports = {
  login,
  getMe,
  createUser,
  editProfile,
};
