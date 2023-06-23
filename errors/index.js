const ValidationError = require('./ValidationError');
const NotFoundError = require('./NotFoundError');
const AuthorizationError = require('./AuthorizationError');
const ConflictError = require('./ConflictError');
const ForbiddenError = require('./ForbiddenError');

module.exports = {
  ValidationError,
  NotFoundError,
  AuthorizationError,
  ConflictError,
  ForbiddenError,
};
