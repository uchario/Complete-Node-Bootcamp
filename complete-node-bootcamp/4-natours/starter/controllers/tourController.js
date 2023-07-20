const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

// const tours = JSON.parse(
//         fs.readFileSync(
//                 `${__dirname}/../dev-data/data/tours-simple.json`
//             )
//     );
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = 'ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
                                    .filter()
                                    .sort()
                                    .limit()
                                    .paginate();
        const tours = await features.query;
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

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: {
                    ratingsAverage: {$gte: 4.5}
                }
            },
            {
                $group: {
                    _id: '$difficulty',
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'},
                }
            },
            {
                $sort: {
                    avgPrice: -1
                }
            }
        ]);
        res.status(200)
                .json({
                    status: 'success',
                    data: {
                        stats
                    }
                });
    } catch(e) {
        res.status(400)
            .json({
                status: 'fail',
                message: e
            });
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = +req.params.year;

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year+2}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numTourStarts: {$sum: 1},
                    tourNames: {$push: '$name'}
                }
            },
            {
                $addFields: {
                    month: '$_id'
                }
            },
            {
                $project: {
                    _id : 1
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
            {
                $limit: 6
            }
        ]);

        res.status(200)
                .json({
                    status: 'success',
                    data: {
                        plan
                    }
                });
    } catch(e) {
        res.status(400)
            .json({
                status: 'fail',
                message: e
            });
    }
}