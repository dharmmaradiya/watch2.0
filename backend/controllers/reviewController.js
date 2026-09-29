const Review = require('../models/Review');
const Product = require('../models/Product');

const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { product, rating, title, comment } = req.body;
    
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product,
    });
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }
    
    const review = await Review.create({
      user: req.user._id,
      product,
      rating,
      title,
      comment,
    });
    
    const productItem = await Product.findById(product);
    const reviews = await Review.find({ product });
    
    productItem.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    productItem.reviewCount = reviews.length;
    await productItem.save();
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (review) {
      if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      
      const product = await Product.findById(review.product);
      await review.deleteOne();
      
      const reviews = await Review.find({ product: review.product });
      if (reviews.length > 0) {
        product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      } else {
        product.rating = 0;
      }
      product.reviewCount = reviews.length;
      await product.save();
      
      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReviewsByProduct,
  createReview,
  deleteReview,
};
