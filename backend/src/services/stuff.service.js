const stuffRepository = require('../repositories/stuff.repository');


// 상품 생성
const createStuff = async (createStuffReqDTO) => {

  // DTO에서 값 꺼내기
  const {
    brandId,
    stuffName,
    price
  } = createStuffReqDTO;


  // 브랜드 존재 여부 확인
  const brand = await stuffRepository.findBrandById(brandId);

  // 없는 브랜드면 상품 생성 불가
  if (!brand) {
    throw new Error('존재하지 않는 브랜드입니다.');
  }


  // 상품 생성
  const newStuff = await stuffRepository.createStuff({
    brandId,
    stuffName,
    price,
  });


  // 프론트에 응답할 데이터 반환
  return {
    stuffId: newStuff.stuffId,
    brandId: newStuff.brandId,
    stuffName: newStuff.stuffName,
    price: newStuff.price,
    isDiscontinued: newStuff.isDiscontinued,
    createdAt: newStuff.createdAt,
    updatedAt: newStuff.updatedAt,
  };
};



// 상품 수정
const updateStuff = async (
  stuffId,
  updateStuffReqDTO
) => {

  // DTO에서 값 꺼내기
  const {
    stuffName,
    price,
    isDiscontinued
  } = updateStuffReqDTO;


  // 수정할 상품 조회
  const stuff = await stuffRepository.findStuffById(stuffId);


  // 상품이 없으면 에러
  if (!stuff) {
    throw new Error('존재하지 않는 상품입니다.');
  }


  // 상품 수정
  await stuffRepository.updateStuff(stuff, {
    stuffName,
    price,
    isDiscontinued,
  });


  // 수정된 데이터 반환
  return {
    stuffId: stuff.stuffId,
    brandId: stuff.brandId,
    stuffName: stuff.stuffName,
    price: stuff.price,
    isDiscontinued: stuff.isDiscontinued,
    createdAt: stuff.createdAt,
    updatedAt: stuff.updatedAt,
  };
};



// 상품 삭제
const deleteStuff = async (stuffId) => {

  // 삭제할 상품 조회
  const stuff = await stuffRepository.findStuffById(stuffId);


  // 상품이 존재하지 않으면 에러
  if (!stuff) {
    throw new Error('존재하지 않는 상품입니다.');
  }


  // soft delete 수행
  await stuffRepository.deleteStuff(stuff);


  // 삭제 성공 메시지 반환
  return {
    message: '상품이 삭제되었습니다.',
  };
};


module.exports = {
  createStuff,
  updateStuff,
  deleteStuff,
};