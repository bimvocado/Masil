// 브랜드 생성 요청 DTO
class CreateBrandReqDTO {
  constructor(brandName, logoUrl, category) {

    // 브랜드명 검사
    if (!brandName) {
      throw new Error('브랜드명을 입력해주세요.');
    }

    // 카테고리 검사
    if (!category) {
      throw new Error('카테고리를 선택해주세요.');
    }

    // ENUM 검사
    if (category !== 'FOOD' && category !== 'HOUSEHOLD'
    ) {
      throw new Error('카테고리가 올바르지 않습니다.');
    }

    this.brandName = brandName;
    this.logoUrl = logoUrl;
    this.category = category;
  }
}

// 브랜드 수정 요청 DTO
class UpdateBrandReqDTO {
  constructor(brandName, logoUrl, category) {

    // 브랜드명 검사
    if (!brandName) {
      throw new Error('브랜드명을 입력해주세요.');
    }

    // ENUM 검사
    if (category !== 'FOOD' && category !== 'HOUSEHOLD'
    ) {
      throw new Error('카테고리가 올바르지 않습니다.');
    }

    this.brandName = brandName;
    this.logoUrl = logoUrl;
    this.category = category;
  }
}

module.exports = {
  CreateBrandReqDTO,
  UpdateBrandReqDTO,
};