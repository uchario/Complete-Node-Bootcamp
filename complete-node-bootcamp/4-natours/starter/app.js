const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

app.use(express.json()); //enables request pareams to be accessible

const port = 8080;

app.use((req, res, next) => {
    console.log('Hello from the middleware🙄');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

const tours = JSON.parse(
        fs.readFileSync(
                `${__dirname}/dev-data/data/tours-simple.json`
            )
    );

const getAllTours = (req, res) => {
    res.status(200)
        .json({
            status: 'success',
            results: tours.length,
            data: {
                tours: tours
            }
        })};

const getTourById = (req, res) => {
    console.log(req.params);
    const id = +req.params.id;
    const tour = tours.find(el => el.id === id);

    if(id > tours.length) {
        return res.status(404)
            .json({
                status: 'Fail',
                message: 'Invalid ID'
            });
    }
    res.status(200)
        .json({
            status: 'success',
            data: {
                tour
            }
        });
};

const updateTourById = (req, res) => {
    if(+req.params.id > tours.length) {
        return res.status(404)
            .json({
                status: 'Fail',
                message: 'Invalid ID'
            });
    }

    res.status(200)
        .json({
            status: 'success',
            data: {
                tour: '<>Updated tour here</>'
            }
        });
};

const deleteTourById = (req, res) => {
    if(+req.params.id > tours.length) {
        return res.status(404)
            .json({
                status: 'Fail',
                message: 'Invalid ID'
            });
    }

    res.status(204)
        .json({
            status: 'success',
            data: null
        });
};

const createTour = (req, res) => {
    console.log(req.body);
    const newId = tours.length;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(
            `${__dirname}/dev-data/data/tours-simple.json`,
            JSON.stringify(tours),
            (err) => {
                res.status(201)
                    .json({
                        status: 'success',
                        data: {
                            tours: newTour
                        }
                    });
            }
        );
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTourById);
// app.delete('/api/v1/tours/:id', deleteTourById);
// app.post('/api/v1/tours', createTour);

app.route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTourById)
    .patch(updateTourById)
    .delete(deleteTourById);

app.listen(port, () => {
    console.log(`App running on ${port}...`);
});