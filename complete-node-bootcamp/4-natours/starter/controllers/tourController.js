const fs = require('fs');

const tours = JSON.parse(
        fs.readFileSync(
                `${__dirname}/../dev-data/data/tours-simple.json`
            )
    );

exports.checkID = (req, res, next, val) => {
    console.log(`Tour id:  ${val}`);
    if(+req.params.id > tours.length) {
        return res.status(404)
            .json({
                status: 'Fail',
                message: 'Invalid ID'
            });
    }
    next();
}

exports.getAllTours = (req, res) => {
    res.status(200)
        .json({
            status: 'success',
            results: tours.length,
            data: {
                tours: tours
            }
        })};

exports.getTourById = (req, res) => {
    console.log(req.params);
    const id = +req.params.id;
    const tour = tours.find(el => el.id === id);
    res.status(200)
        .json({
            status: 'success',
            data: {
                tour
            }
        });
};

exports.updateTourById = (req, res) => {
    res.status(200)
        .json({
            status: 'success',
            data: {
                tour: '<>Updated tour here</>'
            }
        });
};

exports.deleteTourById = (req, res) => {
    res.status(204)
        .json({
            status: 'success',
            data: null
        });
};

exports.createTour = (req, res) => {
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