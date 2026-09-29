const Product = require('../models/Product');
const Category = require('../models/Category');

const getProducts = async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, rating, sort } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }
    
    let sortOption = {};
    if (sort === 'price-low') sortOption = { price: 1 };
    else if (sort === 'price-high') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'popular') sortOption = { reviewCount: -1 };
    else sortOption = { createdAt: -1 };
    
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortOption);
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      description: req.body.description,
      price: req.body.price,
      discountPrice: req.body.discountPrice,
      category: req.body.category,
      images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : req.body.images,
      stock: req.body.stock,
      specifications: req.body.specifications,
      featured: req.body.featured || false,
      trending: req.body.trending || false,
      bestseller: req.body.bestseller || false,
      newArrival: req.body.newArrival || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.brand = req.body.brand || product.brand;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.discountPrice = req.body.discountPrice || product.discountPrice;
      product.category = req.body.category || product.category;
      if (req.files && req.files.length > 0) {
        product.images = req.files.map(file => `/uploads/${file.filename}`);
      } else if (req.body.images) {
        product.images = req.body.images;
      }
      product.stock = req.body.stock || product.stock;
      product.specifications = req.body.specifications || product.specifications;
      product.featured = req.body.featured !== undefined ? req.body.featured : product.featured;
      product.trending = req.body.trending !== undefined ? req.body.trending : product.trending;
      product.bestseller = req.body.bestseller !== undefined ? req.body.bestseller : product.bestseller;
      product.newArrival = req.body.newArrival !== undefined ? req.body.newArrival : product.newArrival;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true })
      .populate('category', 'name')
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ newArrival: true })
      .populate('category', 'name')
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ bestseller: true })
      .populate('category', 'name')
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ trending: true })
      .populate('category', 'name')
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getTrendingProducts,
};
