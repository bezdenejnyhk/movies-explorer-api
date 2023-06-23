const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors');
const { authorizationErrorText } = require('../utils/constant');
const { JWT } = require('../utils/configuration');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError(authorizationErrorText));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT);
  } catch (err) {
    return next(new AuthorizationError(authorizationErrorText));
  }

  req.user = payload;

  return next();
};
module.exports = auth;
