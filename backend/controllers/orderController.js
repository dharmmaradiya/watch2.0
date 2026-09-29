const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod } = req.body;
    
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products in order' });
    }
    
    let subtotal = 0;
    const orderProducts = [];
    
    for (const item of products) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      
      const price = product.discountPrice || product.price;
      subtotal += price * item.quantity;
      
      orderProducts.push({
        product: product._id,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        price: price,
        discountPrice: product.discountPrice,
        quantity: item.quantity,
      });
      
      product.stock -= item.quantity;
      await product.save();
    }
    
    const shipping = subtotal >= 5000 ? 0 : 199;
    const total = subtotal + shipping;
    
    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      shippingAddress,
      subtotal,
      shipping,
      total,
      paymentMethod,
    });
    
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (order) {
      if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (order) {
      order.orderStatus = orderStatus || order.orderStatus;
      order.paymentStatus = paymentStatus || order.paymentStatus;
      
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Processing' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
};
