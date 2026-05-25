const brandRepository = require('../repositories/brand.repository');

// 브랜드 생성
const createBrand = async (createBrandReqDTO) => {
  const { brandName, logoUrl, category } = createBrandReqDTO;

  const existingBrand = await brandRepository.findBrandByName(brandName);

  if (existingBrand) {
    throw new Error('이미 존재하는 브랜드명입니다.');
  }

  const brandData = {
    brandName,
    category,
  };

  if (logoUrl) {
    brandData.logoUrl = logoUrl;
  }

  const newBrand = await brandRepository.createBrand(brandData);

  return {
    brandId: newBrand.brandId,
    brandName: newBrand.brandName,
    logoUrl: newBrand.logoUrl,
    category: newBrand.category,
    createdAt: newBrand.createdAt,
    updatedAt: newBrand.updatedAt,
  };
};

// 브랜드 수정
const updateBrand = async (brandId, updateBrandReqDTO) => {
  const { brandName, logoUrl, category } = updateBrandReqDTO;

  const brand = await brandRepository.findBrandById(brandId);

  if (!brand) {
    throw new Error('존재하지 않는 브랜드입니다.');
  }

  const existingBrand = await brandRepository.findBrandByName(brandName);

  if (existingBrand && existingBrand.brandId !== brand.brandId) {
    throw new Error('이미 존재하는 브랜드명입니다.');
  }

  const updateData = {
    brandName,
    category,
  };

  if (logoUrl) {
    updateData.logoUrl = logoUrl;
  }

  await brandRepository.updateBrand(brand, updateData);

  return {
    brandId: brand.brandId,
    brandName: brand.brandName,
    logoUrl: brand.logoUrl,
    category: brand.category,
    createdAt: brand.createdAt,
    updatedAt: brand.updatedAt,
  };
};

// 브랜드 삭제
const deleteBrand = async (brandId) => {
  const brand = await brandRepository.findBrandById(brandId);

  if (!brand) {
    throw new Error('존재하지 않는 브랜드입니다.');
  }

  await brandRepository.deleteBrand(brand);

  return {
    message: '브랜드가 삭제되었습니다.',
  };
};

// 브랜드 탐색 페이지 조회
const searchBrands = async (
  keyword,
  category
) => {

  // 카테고리 검증
  if (
    category &&
    category !== 'FOOD' &&
    category !== 'HOUSEHOLD'
  ) {
    throw new Error(
      '카테고리가 올바르지 않습니다.'
    );
  }


  const brands =
    await brandRepository.searchBrands(
      keyword,
      category
    );


  // 프론트 카드 형태 응답
  return brands.map((brand) => ({
    brandId: brand.brandId,
    brandName: brand.brandName,
    logoUrl: brand.logoUrl,
    category: brand.category,
  }));
};

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  searchBrands,
};