const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('./middlewares/cors');
const limiter = require('./utils/rateLimit');
const errorWithoutStatus = require('./middlewares/errorWithoutStatus');
const router = require('./routes');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');

const { PORT, MONGO_BD } = require('./utils/configuration');

const app = express();

mongoose.connect(MONGO_BD);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(requestLogger);
app.use(cors);

app.use(limiter);
app.use(router);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(errorLogger);
app.use(errors());
app.use(errorWithoutStatus);

app.listen(PORT, () => {
  console.log(`SERVER START. PORT => ${PORT}`);
});
