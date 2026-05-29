const brandRepository = require('../repositories/brand.repository');

const {
  toBrandListDTO,
  toBrandSearchResultDTO,
  toBrandStuffListDTO,
} = require('../dtos/brand.dto');

// 검색창 - 브랜드 리스트 3열
const getBrandList = async ({ keyword, category }) => {
  const brands = await brandRepository.findBrands({
    keyword,
    category,
  });

  return toBrandListDTO(brands);
};

// 검색창 - 브랜드로 검색
const searchBrands = async ({ keyword, category }) => {
  const brands = await brandRepository.findBrands({
    keyword,
    category,
  });

  return toBrandSearchResultDTO(brands);
};

// 브랜드창 - 상품 리스트 나열
const getBrandStuffList = async ({ brandId, sort, page, size }) => {
  const brand = await brandRepository.findBrandInfo(brandId);

  if (!brand) {
    const error = new Error('존재하지 않는 브랜드입니다.');
    error.status = 404;
    throw error;
  }

  const rows = await brandRepository.findStuffsByBrand({
    brandId,
    sort,
    page,
    size,
  });

  const hasNext = rows.length > size;
  const stuffs = hasNext ? rows.slice(0, size) : rows;

  return toBrandStuffListDTO({
    brand,
    stuffs,
    page,
    size,
    hasNext,
  });
};

module.exports = {
  getBrandList,
  searchBrands,
  getBrandStuffList,
};