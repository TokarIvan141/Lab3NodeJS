const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

router.get('/', bookController.getAll.bind(bookController));
router.get('/:id', bookController.getById.bind(bookController));
router.post('/', bookController.create.bind(bookController));
router.delete('/:id', bookController.delete.bind(bookController));

module.exports = router;