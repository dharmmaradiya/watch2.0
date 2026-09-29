const express = require('express');
const router = express.Router();
const {
  getReviewsByProduct,
  createReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/product/:productId')
  .get(getReviewsByProduct)
  .post(protect, createReview);

router.route('/:id')
  .delete(protect, deleteReview);

module.exports = router;
