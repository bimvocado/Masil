const { Op } = require('sequelize');

const Brand = require('../models/brand.model');
const Stuff = require('../models/stuff.model');

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

// 브랜드명 또는 상품명으로 브랜드 검색
const searchBrands = async (keyword, category) => {
  const where = {};

  // category로 FOOD / HOUSEHOLD 필터링
  if (category) {
    where.category = category;
  }

  // 검색어가 없으면 카테고리에 해당하는 브랜드 전체 조회
  if (!keyword) {
    return await Brand.findAll({
      where,
      order: [['brandName', 'ASC']],
    });
  }

  // 검색어가 있으면 브랜드명 또는 상품명 기준으로 검색
  return await Brand.findAll({
    where,
    include: [
      {
        model: Stuff,
        required: false,
        attributes: [],
      },
    ],
    where: {
      ...where,
      [Op.or]: [
        // 브랜드 이름 검색
        {
          brandName: {
            [Op.like]: `%${keyword}%`,
          },
        },
        // 상품 이름 검색
        {
          '$Stuffs.stuff_name$': {
            [Op.like]: `%${keyword}%`,
          },
        },
      ],
    },
    order: [['brandName', 'ASC']],
    distinct: true,
  });
};

module.exports = {
  createBrand,
  findBrandById,
  findBrandByName,
  updateBrand,
  deleteBrand,
  searchBrands,
};