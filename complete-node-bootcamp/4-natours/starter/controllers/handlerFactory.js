const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = (Model) => catchAsync( async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if(!doc) {
        return next(new AppError("Doc ID doesn't exist", 404));
    }
    res.status(204)
    .json({
        status: 'success',
        data: null
    });
   
});

exports.updateOne = (Model) => catchAsync ( async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        {
            new: true,
            runValidators: true
        }
    );
    if(!doc) {
        return next(new AppError("Doc ID doesn't exist", 404));
    }
    res.status(200)
    .json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.createOne = (Model) => catchAsync( async (req, res, next) => {
    const doc = await Model.create(req.body);
        res.status(201)
                .json({
                    status: 'success',
                    data: {
                        data: doc
                    }
                })
            });

exports.getOne = (Model, popOptions) => catchAsync ( async (req, res, next) => {
    let query =  await Model.findById(req.params.id);
    query = popOptions ? query.populate(popOptions) : query;

    const doc = query;

    if(!doc) {
        return next(new AppError("Doc ID doesn't exist", 404));
    }
    res.status(200)
    .json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.getAll = (Model) => catchAsync( async (req, res, next) => {
    let filter = {};
    filter = req.params.tourId ? {tour: req.params.tourId} : filter;

    const features = new APIFeatures(Model.find(filter), req.query)
                                .filter()
                                .sort()
                                .limit()
                                .paginate();
    const doc = await features.query;
    // const tours = await Tour.find()
    //                         .where('duration')
    //                         .equals(5)
    //                         .where('difficulty')
    //                         .equals('easy');
    res.status(200)
        .json({
            status: 'success',
            results: doc.length,
            data: {
                data: doc
            }
        });
});