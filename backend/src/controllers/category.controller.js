const categoryService = require('../services/category.service');

const getCategories = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const categories = await categoryService.getCategories(userId);
    return res.status(200).json({ success: true, message: '카테고리 조회 성공', data: categories });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { categoryName } = req.body;
    const category = await categoryService.createCategory(userId, categoryName);
    return res.status(201).json({ success: true, message: '카테고리 생성 성공', data: category });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { categoryName } = req.body;
    const category = await categoryService.updateCategory(categoryId, categoryName);
    return res.status(200).json({ success: true, message: '카테고리 수정 성공', data: category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    await categoryService.deleteCategory(categoryId);
    return res.status(200).json({ success: true, message: '카테고리 삭제 성공', data: null });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };