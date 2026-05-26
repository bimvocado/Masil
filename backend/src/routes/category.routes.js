const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

router.get('/:userId/categories', categoryController.getCategories);
router.post('/:userId/categories', categoryController.createCategory);
router.put('/categories/:categoryId', categoryController.updateCategory);
router.delete('/categories/:categoryId', categoryController.deleteCategory);

module.exports = router;