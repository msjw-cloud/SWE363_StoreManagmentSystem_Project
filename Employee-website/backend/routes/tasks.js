// routes/tasks.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paginate = require('../middleware/paginate');
const validate = require('../middleware/validation');
const {
    getTasks,
    createTask,
    updateTaskStatus,
    deleteTask
} = require('../controllers/taskController');

router.get('/', [auth, paginate], getTasks);
router.post('/', [auth, validate], createTask);
router.put('/:id/status', [auth, validate], updateTaskStatus);
router.delete('/:id', auth, deleteTask);

module.exports = router;