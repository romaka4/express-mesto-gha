const express = require('express');
const mongoose = require('mongoose');
const app = express(); 
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// const { PORT = 3000 } = process.env;
const { PORT = 3001, DB_URL = 'mongodb://127.0.0.1:27017/mestodb'} = process.env;
mongoose.connect(DB_URL);
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//  app.use('/', (req, res, next) =>{
//   console.log(req.headers);
//   res.status(200).send({message: "Ответ2"});
//   next();
//  });
app.use((req, res, next) => {
  req.user = {
    _id: '65a42cdb0f1e71717498e6c3'
  };

  next();
});
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port to ${PORT}`)
}) 

// mongoose.connect('mongodb://localhost:27017/mydb', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//     useFindAndModify: false
// });

// // подключаем мидлвары, роуты и всё остальное...

// app.listen(3000); 
