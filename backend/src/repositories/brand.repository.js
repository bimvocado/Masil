const Brand = require('../models/brand.model');

// 브랜드 생성
const createBrand = async (brandData) => {
  return await Brand.create(brandData);
};

// 브랜드 ID로 조회
const findBrandById = async (brandId) => {
  return await Brand.findByPk(brandId);
};

// 브랜드명 중복 확인
const findBrandByName = async (brandName) => {
  return await Brand.findOne({
    where: { brandName },
  });
};

// 브랜드 수정
const updateBrand = async (brand, updateData) => {
  return await brand.update(updateData);
};

// 브랜드 삭제
const deleteBrand = async (brand) => {
  return await brand.destroy();
};

module.exports = {
  createBrand,
  findBrandById,
  findBrandByName,
  updateBrand,
  deleteBrand,
};