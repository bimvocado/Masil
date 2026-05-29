// 검색창 - 브랜드 카드 1개
const toBrandCardDTO = (brand) => {
  return {
    brandId: brand.brandId,
    brandName: brand.brandName,
    logoUrl: brand.logoUrl,
    category: brand.category,
  };
};

// 검색창 - 브랜드 리스트 3열
const toBrandListDTO = (brands) => {
  return {
    listSize: brands.length,
    brands: brands.map(toBrandCardDTO),
  };
};

// 검색창 - 브랜드로 검색
const toBrandSearchDTO = (brand) => {
  return {
    brandId: brand.brandId,
    brandName: brand.brandName,
    logoUrl: brand.logoUrl,
    category: brand.category,
  };
};

// 검색창 - 브랜드 검색 결과
const toBrandSearchResultDTO = (brands) => {
  return {
    brandListSize: brands.length,
    brands: brands.map(toBrandSearchDTO),
  };
};

// 브랜드창 - 상품 카드 1개
const toBrandStuffCardDTO = (stuff) => {
  return {
    stuffId: stuff.stuffId,
    stuffName: stuff.stuffName,
    price: stuff.price,

    imageUrl: stuff.imageUrl,

    likeCount: Number(stuff.likeCount || 0),
    dislikeCount: Number(stuff.dislikeCount || 0),
    postCount: Number(stuff.postCount || 0),
  };
};

// 브랜드창 - 상품 리스트 나열
const toBrandStuffListDTO = ({
  brand,
  stuffs,
  page,
  size,
  hasNext,
}) => {
  return {
    brandId: brand.brandId,
    brandName: brand.brandName,
    logoUrl: brand.logoUrl,
    category: brand.category,

    totalStuffCount: Number(
      brand.totalStuffCount || 0
    ),

    page,
    size,
    hasNext,

    stuffs: stuffs.map(toBrandStuffCardDTO),
  };
};

module.exports = {
  toBrandCardDTO,
  toBrandListDTO,
  toBrandSearchDTO,
  toBrandSearchResultDTO,
  toBrandStuffCardDTO,
  toBrandStuffListDTO,
};