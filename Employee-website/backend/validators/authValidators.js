const { check } = require('express-validator');

exports.registerValidation = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Enter a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

exports.loginValidation = [
  check('email').isEmail().withMessage('Enter a valid email'),
  check('password').exists().withMessage('Password is required')
];