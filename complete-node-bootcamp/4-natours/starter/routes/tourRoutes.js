const express = require('express');
const { 
    getAllTours, 
    createTour, 
    getTourById, 
    updateTourById, 
    deleteTourById,
    aliasTopTours
} = require('./../controllers/tourController');

const router = express.Router();

// router.param('id', checkID);

router.route('/top-5-cheap')
    .get(aliasTopTours, getAllTours);

router.route('/')
    .get(getAllTours)
    .post(createTour);

router.route('/:id')
    .get(getTourById)
    .patch(updateTourById)
    .delete(deleteTourById);


module.exports = router;