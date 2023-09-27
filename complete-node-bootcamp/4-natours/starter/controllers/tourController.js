const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

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

exports.getAllTours = catchAsync( async (req, res, next) => {
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
});

exports.getTourById = catchAsync ( async (req, res, next) => {
    const tour = await Tour.findById(req.params.id).populate('reviews');
    if(!tour) {
        return next(new AppError("Tour ID doesn't exist", 404));
    }
    res.status(200)
    .json({
        status: 'success',
        data: {
            tour
        }
    });
});

// exports.updateTourById = catchAsync ( async (req, res, next) => {
//     const tour = await Tour.findByIdAndUpdate(
//         req.params.id, 
//         req.body, 
//         {
//             new: true,
//             runValidators: true
//         }
//     );
//     if(!tour) {
//         return next(new AppError("Tour ID doesn't exist", 404));
//     }
//     res.status(200)
//     .json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
// });

// exports.deleteTourById = catchAsync( async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id);
//     if(!tour) {
//         return next(new AppError("Tour ID doesn't exist", 404));
//     }
//     res.status(204)
//     .json({
//         status: 'success',
//         data: tour
//     });
   
// });

exports.updateTourById = factory.updateOne(Tour);

exports.deleteTourById = factory.deleteOne(Tour);

// exports.createTour = catchAsync( async (req, res, next) => {
//     const newTour = await Tour.create(req.body);
//         res.status(201)
//                 .json({
//                     status: 'success',
//                     data: {
//                         tours: newTour
//                     }
//                 });
    // try {
        
    // } catch(e) {
    //     res.status(400)
    //         .json({
    //             status: 'fail',
    //             message: e
    //         });
    // }
// });

exports.createTour = factory.createOne(Tour);

exports.getTourStats = catchAsync( async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: {
                ratingsAverage: {$gte: 4.5}
            }
        },
        {
            $group: {
                _id: '$difficulty',
                numTours: {$sum: 1},
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
});

exports.getMonthlyPlan = catchAsync( async (req, res, next) => {
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
});