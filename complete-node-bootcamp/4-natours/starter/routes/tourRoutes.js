const express = require('express');
const { 
    getAllTours, 
    createTour, 
    getTourById, 
    updateTourById, 
    deleteTourById,
    checkID
} = require('./../controllers/tourController');

const router = express.Router();

router.param('id', checkID);

router.route('/')
    .get(getAllTours)
    .post(createTour);

router.route('/:id')
    .get(getTourById)
    .patch(updateTourById)
    .delete(deleteTourById);


module.exports = router;