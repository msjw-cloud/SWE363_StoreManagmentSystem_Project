const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paginate = require('../middleware/paginate');
const { orderValidation, statusValidation } = require('../validators/orderValidators');
const validate = require('../middleware/validation');
const {
    getOrders,
    createOrder,
    updateOrderStatus,
    getOrderById
} = require('../controllers/orderController');

router.get('/', [auth, paginate], getOrders);
router.get('/:id', auth, getOrderById);
router.post('/', [auth, orderValidation, validate], createOrder);
router.put('/:id/status', [auth, statusValidation, validate], updateOrderStatus);

module.exports = router;