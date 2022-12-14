const path = require('path')
const express = require('express')

const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')

const cookieParser = require('cookie-parser')

const compression = require('compression')
const cors = require('cors')
const globalErrorHandler = require('./Handler/Error.handler');
const AppError = require('./Utils/AppError');
const indexRouter = require('./Routes/index.routes')
const app = express();
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'Views'))
app.enable('trust proxy');
app.use(cors());
app.options('*', cors())
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime)
  // console.log(req.cookies);
  next();
});


app.use('/api/v1', indexRouter)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler);

module.exports = app;