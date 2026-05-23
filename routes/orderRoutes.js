const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST routes first (more specific routes before parameterized ones)
router.post('/', orderController.createOrder);
router.post('/delete/by-status', orderController.deleteOrdersByStatus);

// GET routes
router.get('/', orderController.getOrders);

// PATCH routes with parameters
router.patch('/:id/status', orderController.updateOrderStatus);

// DELETE routes
router.delete('/:id', orderController.deleteOrder);

module.exports = router;

