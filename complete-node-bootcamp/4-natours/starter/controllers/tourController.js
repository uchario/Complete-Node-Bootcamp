const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//         fs.readFileSync(
//                 `${__dirname}/../dev-data/data/tours-simple.json`
//             )
//     );
exports.getAllTours = (req, res) => {
    res.status(200)
        .json({
            status: 'success',
            results: tours.length,
            // data: {
            //     tours: tours
            // }
        })};

exports.getTourById = (req, res) => {
    console.log(req.params);
    const id = +req.params.id;
    // const tour = tours.find(el => el.id === id);
    res.status(200)
        .json({
            status: 'success',
            // data: {
            //     tour
            // }
        });
};

exports.updateTourById = (req, res) => {
    res.status(200)
        .json({
            status: 'success',
            // data: {
            //     tour: '<>Updated tour here</>'
            // }
        });
};

exports.deleteTourById = (req, res) => {
    res.status(204)
        .json({
            status: 'success',
            data: null
        });
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201)
                        .json({
                            status: 'success',
                            data: {
                                tours: newTour
                            }
                        });
    } catch(e) {
        res.status(400)
            .json({
                status: 'fail',
                message: e
            });
    }
    
};