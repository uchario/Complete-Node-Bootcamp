const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// set security HTTP headers
app.use(helmet());

// Middleware for data about routes
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP'
});

app.use('/api', limiter);

// enables request params to be accessible
// body parser, reading data from body into req.body
app.use(express.json());

// serving status content
app.use(express.static(`${__dirname}/public`)); 

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTourById);
// app.delete('/api/v1/tours/:id', deleteTourById);
// app.post('/api/v1/tours', createTour);

// 3. Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // })
    // const err = new Error('Something went wrong');
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new AppError('Something went wrong', 404));
});

app.use(globalErrorHandler);

module.exports = app;
