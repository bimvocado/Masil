const Category = require('../models/category.model');

const findCategoriesByUserId = async (userId) => {
  return await Category.findAll({ where: { userId } });
};

const createCategory = async (userId, categoryName, options = {}) => {
  return await Category.create({ userId, categoryName }, options);
};

const updateCategory = async (categoryId, categoryName) => {
  const category = await Category.findOne({ where: { categoryId } });
  if (!category) return null;
  category.categoryName = categoryName;
  return await category.save();
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findOne({ where: { categoryId } });
  if (!category) return null;
  return await category.destroy();
};

module.exports = { findCategoriesByUserId, createCategory, updateCategory, deleteCategory };