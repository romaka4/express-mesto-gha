module.exports = ((err, req, res, next) => {
  console.log(err);
  // if (err.name === 'NotFoundError') {
  //   console.log('i am');
  //   res.status(err.statusCode).send({ messaege: err.message });
  //   return;
  // } else {
  //   res.status(500).send({ message: 'Произошла ошибка на стороне сервера' });
  // }
  // if (!err.statusCode) {
  //   const { statusCode = 500, message } = err;
  //   res.status(statusCode).send({
  //     message: statusCode === 500 ? 'На сервере произошла ошибка'
  //       : message,
  //   });
  // }
  // res.status(err.statusCode).send({ message: err.message });
  // next();
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      message: statusCode === 500 ? 'На сервере произошла ошибка'
        : message,
    });
  }
  next();
});
