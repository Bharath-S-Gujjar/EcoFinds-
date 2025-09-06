const express = require('express');
const Purchase = require('../models/Purchase');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Checkout cart items
router.post('/checkout', auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Group items by seller
    const sellerGroups = {};
    let totalAmount = 0;

    for (const item of cart.items) {
      const sellerId = item.product.seller.toString();
      
      if (!sellerGroups[sellerId]) {
        sellerGroups[sellerId] = {
          seller: item.product.seller,
          items: []
        };
      }

      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;

      sellerGroups[sellerId].items.push({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      });
    }

    // Create purchases for each seller
    const purchases = [];
    for (const sellerId in sellerGroups) {
      const group = sellerGroups[sellerId];
      const purchaseTotal = group.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const purchase = new Purchase({
        buyer: req.user._id,
        seller: group.seller,
        items: group.items,
        totalAmount: purchaseTotal,
        shippingAddress,
        paymentMethod: paymentMethod || 'Credit Card',
        notes
      });

      await purchase.save();
      await purchase.populate([
        { path: 'buyer', select: 'username email' },
        { path: 'seller', select: 'username email' },
        { path: 'items.product', select: 'title price images' }
      ]);

      purchases.push(purchase);
    }

    // Mark products as unavailable
    const productIds = cart.items.map(item => item.product._id);
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { isAvailable: false } }
    );

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: 'Checkout successful',
      purchases,
      totalAmount
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Server error during checkout' });
  }
});

// Get user's purchase history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const purchases = await Purchase.find({ buyer: req.user._id })
      .populate([
        { path: 'seller', select: 'username avatar' },
        { path: 'items.product', select: 'title price images category' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Purchase.countDocuments({ buyer: req.user._id });

    res.json({
      purchases,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalPurchases: total
      }
    });
  } catch (error) {
    console.error('Get purchase history error:', error);
    res.status(500).json({ message: 'Server error while fetching purchase history' });
  }
});

// Get user's sales history
router.get('/sales', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sales = await Purchase.find({ seller: req.user._id })
      .populate([
        { path: 'buyer', select: 'username avatar' },
        { path: 'items.product', select: 'title price images category' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Purchase.countDocuments({ seller: req.user._id });

    res.json({
      sales,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalSales: total
      }
    });
  } catch (error) {
    console.error('Get sales history error:', error);
    res.status(500).json({ message: 'Server error while fetching sales history' });
  }
});

// Get single purchase details
router.get('/:id', auth, async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate([
        { path: 'buyer', select: 'username email avatar' },
        { path: 'seller', select: 'username email avatar' },
        { path: 'items.product', select: 'title price images category description' }
      ]);

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    // Check if user is buyer or seller
    const isBuyer = purchase.buyer._id.toString() === req.user._id.toString();
    const isSeller = purchase.seller._id.toString() === req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: 'Not authorized to view this purchase' });
    }

    res.json(purchase);
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({ message: 'Server error while fetching purchase' });
  }
});

// Update purchase status (for sellers)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    const purchase = await Purchase.findById(req.params.id);

    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    // Check if user is the seller
    if (purchase.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this purchase' });
    }

    purchase.status = status;
    await purchase.save();

    await purchase.populate([
      { path: 'buyer', select: 'username email avatar' },
      { path: 'seller', select: 'username email avatar' },
      { path: 'items.product', select: 'title price images category' }
    ]);

    res.json({
      message: 'Purchase status updated successfully',
      purchase
    });
  } catch (error) {
    console.error('Update purchase status error:', error);
    res.status(500).json({ message: 'Server error while updating purchase status' });
  }
});

module.exports = router;
