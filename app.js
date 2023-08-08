const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');
const kegiatanRouter = require('./routes/kegiatanRoutes');
const berandaRouter = require('./routes/berandaRoutes');
const tentangRouter = require('./routes/tentangRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errController');
// const User = require('./models/userModel');

const app = express();
// global middleware
app.use(cors());
// set security http headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});

// limit requests from same API
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json());

// data sanitization against XSS
app.use(xss());

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/kegiatan', kegiatanRouter);
app.use('/api/v1/beranda', berandaRouter);
app.use('/api/v1/tentang', tentangRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
const sequelize = require('./utils/database');

const sync = async () => await sequelize.sync({});
sync()
  .then(() => {
    // User.create({
    //   email: 'test@test.com',
    //   password: '123456',
    //   name: 'neo',
    // });
    // User.create({
    //   email: 'test2@test.com',
    //   password: '123456',
    //   name: 'celeb_neo',
    // });
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

app.use(globalErrorHandler);

module.exports = app;
