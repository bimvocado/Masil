const Stuff = require('../models/stuff.model');
const Brand = require('../models/brand.model');


// 상품 생성
const createStuff = async (stuffData) => {
  return await Stuff.create(stuffData);
};


// 상품 ID로 조회
const findStuffById = async (stuffId) => {
  return await Stuff.findByPk(stuffId);
};


// 상품 생성 시 존재하는 브랜드인지 확인
const findBrandById = async (brandId) => {
  return await Brand.findByPk(brandId);
};


// 상품 수정
const updateStuff = async (stuff, updateData) => {
  return await stuff.update(updateData);
};


// 상품 삭제
const deleteStuff = async (stuff) => {
  return await stuff.destroy();
};

module.exports = {
  createStuff,
  findStuffById,
  findBrandById,
  updateStuff,
  deleteStuff,
};