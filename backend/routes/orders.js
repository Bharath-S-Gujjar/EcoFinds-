const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new order (checkout)
router.post('/checkout', auth, async (req, res) => {
  try {
    const { address, location, paymentMethod, notes, products, totalAmount } = req.body;

    // Validation
    if (!address || !address.street || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({ message: 'Please provide complete address information' });
    }

    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    let orderProducts;
    let calculatedTotalAmount;

    // Check if this is a BuyNow order (products provided directly) or Cart checkout
    if (products && products.length > 0) {
      // BuyNow order - use provided products
      orderProducts = products;
      calculatedTotalAmount = totalAmount;
    } else {
      // Cart checkout - get from cart
      const cart = await Cart.findOne({ user: req.user._id })
        .populate('items.product');

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      // Prepare order products from cart
      orderProducts = cart.items.map(item => ({
        productId: item.product._id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        seller: item.product.seller
      }));

      // Calculate total amount from cart
      calculatedTotalAmount = cart.items.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0);
    }

    // Create new order
    const order = new Order({
      userId: req.user._id,
      products: orderProducts,
      address,
      location,
      paymentMethod,
      totalAmount: calculatedTotalAmount,
      notes
    });

    await order.save();

    // Mark products as unavailable
    const productIds = orderProducts.map(item => item.productId);
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { isAvailable: false } }
    );

    // Clear the cart only if it was a cart checkout
    if (!products || products.length === 0) {
      const cart = await Cart.findOne({ user: req.user._id });
      if (cart) {
        cart.items = [];
        await cart.save();
      }
    }

    // Populate order with product details
    await order.populate([
      { path: 'products.productId', select: 'title price images' },
      { path: 'products.seller', select: 'username email' }
    ]);

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Server error during checkout' });
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find({ userId: req.user._id })
      .populate([
        { path: 'products.productId', select: 'title price images' },
        { path: 'products.seller', select: 'username email' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments({ userId: req.user._id });

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// Get single order details
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate([
        { path: 'products.productId', select: 'title price images description' },
        { path: 'products.seller', select: 'username email avatar' }
      ]);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

// Update order status (for admin/seller use)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is the buyer
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();

    await order.populate([
      { path: 'products.productId', select: 'title price images' },
      { path: 'products.seller', select: 'username email' }
    ]);

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status' });
  }
});

module.exports = router;
