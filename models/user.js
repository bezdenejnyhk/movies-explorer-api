const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const AuthorizationError = require('../errors/AuthorizationError');
const { authorizationErrorText } = require('../utils/constant');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new AuthorizationError(authorizationErrorText),
        );
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(
              new AuthorizationError(authorizationErrorText),
            );
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
