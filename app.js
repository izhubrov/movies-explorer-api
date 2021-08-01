require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const checkError = require('./middlewares/checkError');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const rateLimiter = require('./middlewares/rateLimiter');
const { mongoSettings, corsOptions, mongoUrl } = require('./utils/utils');
const router = require('./routes/index');

const app = express();
const { NODE_ENV, PORT, DATABASE_URL } = process.env;

mongoose.connect(NODE_ENV === 'production' ? DATABASE_URL : mongoUrl, mongoSettings);
app.use(requestLogger);
app.set('trust proxy', 1);
app.use(rateLimiter);
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(router);

app.use(checkError, errorLogger, errorHandler);

app.listen(NODE_ENV === 'production' ? PORT : 3001);
