const ValidationError = require('../errors/validation-error');

module.exports = ((err, req, res, next) => {
  if (err.name === 'NotFoundError') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    res.status(ValidationError.statusCode).send({ message: ValidationError.message });
    return;
  }
  if (err.name === 'ForbiddenError') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  if (err.name === 'ConflictError') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  if (err.name === 'UnauthorizedError') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }
  if (!err.statusCode) {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      message: statusCode === 500 ? 'На сервере произошла ошибка'
        : message,
    });
  }
  next();
});
