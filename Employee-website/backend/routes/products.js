const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');
const upload = require('../middleware/upload');
const paginate = require('../middleware/paginate');
const { productValidation } = require('../validators/productValidators');
const validate = require('../middleware/validation');
const { 
    getProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');

router.get('/', [auth, paginate], getProducts);
router.post('/', [
    auth, 
    roleAuth(['admin', 'manager']), // Changed here
    upload.single('image'),
    productValidation,
    validate
], createProduct);
router.put('/:id', [
    auth, 
    roleAuth(['admin', 'manager']), // Changed here
    upload.single('image'),
    productValidation,
    validate
], updateProduct);
router.delete('/:id', [auth, roleAuth(['admin'])], deleteProduct); // Changed here

module.exports = router;