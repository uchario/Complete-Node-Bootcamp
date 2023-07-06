const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes')
const app = express();

// Middleware for data about routes
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json()); //enables request params to be accessible
app.use(express.static(`${__dirname}/public`)); //serving status content

app.use((req, res, next) => {
    console.log('Hello from the middleware🙄');
    next();
});

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

module.exports = app;
