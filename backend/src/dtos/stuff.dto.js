// 상품 생성 요청 DTO
class CreateStuffReqDTO {
  constructor(brandId, stuffName, price) {

    // 브랜드 선택 여부 검사
    if (!brandId) {
      throw new Error('브랜드를 선택해주세요.');
    }

    // 상품명 검사
    if (!stuffName) {
      throw new Error('상품명을 입력해주세요.');
    }

    // 가격 숫자 검사
    if (price === undefined || price === null || isNaN(Number(price))
    ) {
      throw new Error('가격은 숫자여야 합니다.');
    }

    this.brandId = brandId;
    this.stuffName = stuffName;
    this.price = Number(price);
  }
}

// 상품 수정 요청 DTO
class UpdateStuffReqDTO {
  constructor(stuffName, price, isDiscontinued) {

    // 상품명 검사
    if (!stuffName) {
      throw new Error('상품명을 입력해주세요.');
    }

    // 가격 숫자 검사
    if (price === undefined || price === null || isNaN(Number(price))) {
      throw new Error('가격은 숫자여야 합니다.');
    }

    this.stuffName = stuffName;
    this.price = Number(price);
    this.isDiscontinued = isDiscontinued;
  }
}

module.exports = {
  CreateStuffReqDTO,
  UpdateStuffReqDTO,
};