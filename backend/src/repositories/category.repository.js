const Category = require('../models/category.model');
const Scrap = require('../models/scrap.model');
const sequelize = require('../config/db');

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

  const transaction = await sequelize.transaction();
  try {
    await Scrap.destroy({ where: { categoryId }, transaction });
    const result = await category.destroy({ transaction });
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = { findCategoriesByUserId, createCategory, updateCategory, deleteCategory };