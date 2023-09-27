const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({mergeParams: true});

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect, 
        authController.restrictTo('guide'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

module.exports = router;

router.route('/:id')
        .get(reviewController.getReview)
        .patch(reviewController.updateReview)
        .delete(reviewController.deleteReview);