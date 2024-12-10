const { check } = require('express-validator');

exports.productValidation = [
    check('product').notEmpty().withMessage('Product name is required'),
    check('category').isIn(['Refrigerators', 'Washing Machines', 'ACs', 'Dishwashers', 'Cooking'])
        .withMessage('Invalid category'),
    check('items').isInt({ min: 0 }).withMessage('Items must be a positive number'),
    check('price').isFloat({ min: 0 }).withMessage('Price must be a positive number')
];