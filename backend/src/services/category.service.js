const categoryRepository = require('../repositories/category.repository');

const getCategories = async (userId) => {
  return await categoryRepository.findCategoriesByUserId(userId);
};

const createCategory = async (userId, categoryName) => {
  return await categoryRepository.createCategory(userId, categoryName);
};

const updateCategory = async (categoryId, categoryName) => {
  return await categoryRepository.updateCategory(categoryId, categoryName);
};

const deleteCategory = async (categoryId) => {
  return await categoryRepository.deleteCategory(categoryId);
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };