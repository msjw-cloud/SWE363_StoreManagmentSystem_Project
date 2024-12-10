const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paginate = require('../middleware/paginate');
const validate = require('../middleware/validation');
const {
    getReturns,
    createReturn,
    updateReturnStatus,
    getReturnById
} = require('../controllers/returnController');

router.get('/', [auth, paginate], getReturns);
router.get('/:id', auth, getReturnById);
router.post('/', [auth, validate], createReturn);
router.put('/:id/status', [auth, validate], updateReturnStatus);

module.exports = router;