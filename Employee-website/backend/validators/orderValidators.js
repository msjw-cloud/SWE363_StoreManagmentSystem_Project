const { check } = require('express-validator');

exports.orderValidation = [
    check('customer.name')
        .notEmpty()
        .withMessage('Customer name is required'),
    check('customer.address')
        .notEmpty()
        .withMessage('Customer address is required'),
    check('customer.phone')
        .notEmpty()
        .withMessage('Customer phone is required'),
    check('product')
        .isMongoId()
        .withMessage('Valid product ID is required'),
    check('items')
        .isInt({ min: 1 })
        .withMessage('Must order at least 1 item'),
    check('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number')
];

exports.statusValidation = [
    check('status')
        .isIn(['pending', 'processing', 'shipping', 'delivered'])
        .withMessage('Invalid status')
];