const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//         fs.readFileSync(
//                 `${__dirname}/../dev-data/data/tours-simple.json`
//             )
//     );
exports.getAllTours = async (req, res) => {
    try {
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);
        
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        const query = Tour.find(JSON.parse(queryStr));
        console.log(req.query);
        const tours = await query;
        // const tours = await Tour.find()
        //                         .where('duration')
        //                         .equals(5)
        //                         .where('difficulty')
        //                         .equals('easy');
        res.status(200)
            .json({
                status: 'success',
                results: tours.length,
                data: {
                    tours: tours
                }
            });
    } catch(e) {
        res.status(404)
            .json({
                status: 'fail',
                message: e
        });
    }
}
    

exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200)
        .json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch(e) {
        res.status(404)
            .json({
                status: 'fail',
                message: e
            });
    }
};

exports.updateTourById = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {
                new: true,
                runValidators: true
            }
        );
        res.status(200)
        .json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch(e) {
        res.status(404)
            .json({
                status: 'fail',
                message: e
            });
    }
};

exports.deleteTourById = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(204)
        .json({
            status: 'success',
            data: tour
        });
    }catch(e) {
        res.status(404)
            .json({
                status: 'fail',
                message: e
            });
    }
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