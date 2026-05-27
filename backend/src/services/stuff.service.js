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


// 브랜드별 상품 목록 조회
const getStuffsByBrandId = async (
  brandId,
  sort = 'LATEST',
  page = 0,
  size = 10
) => {
  // URL params는 문자열로 들어오므로 숫자로 변환
  const brandIdNum = Number(brandId);

  // 브랜드 존재 여부 확인
  const brand = await stuffRepository.findBrandById(brandIdNum);
  console.log('[DEBUG] brandId 수신값:', brandIdNum, '/ 타입:', typeof brandIdNum);
  console.log('[DEBUG] brand 조회 결과:', brand ? `${brand.brandId} - ${brand.brandName}` : 'null (브랜드 없음)');

  if (!brand) {
    throw new Error('존재하지 않는 브랜드입니다.');
  }

  // 정렬값 검증
  if (
    sort !== 'LIKE_DESC' &&
    sort !== 'DISLIKE_ASC' &&
    sort !== 'LATEST'
  ) {
    throw new Error('정렬 기준이 올바르지 않습니다.');
  }

  const stuffList = await stuffRepository.findStuffsByBrandId(
    brandIdNum,
    sort,
    page,
    size
  );
  console.log('[DEBUG] stuffList 결과:', stuffList.length, '개');

  const totalElements = await stuffRepository.countStuffsByBrandId(brandIdNum);
  console.log('[DEBUG] totalElements:', totalElements);

  const pageNumber = Number(page);
  const pageSize = Number(size);
  const totalPages = Math.ceil(totalElements / pageSize);

  return {
    brandId: brand.brandId,
    brandName: brand.brandName,

    totalElements,
    totalPages,
    currentPage: pageNumber,
    pageSize,
    isFirst: pageNumber === 0,
    isLast: pageNumber + 1 >= totalPages,

    stuffList: stuffList.map((stuff, index) => ({
      rank: pageNumber * pageSize + index + 1,
      stuffId: stuff.stuffId,
      brandId: stuff.brandId,
      stuffName: stuff.stuffName,
      price: Number(stuff.price || 0),
      likeCount: Number(stuff.likeCount || 0),
      dislikeCount: Number(stuff.dislikeCount || 0),
      createdAt: stuff.createdAt,
    })),
  };
};

// 상품 상세 페이지 조회
const getStuffDetail = async (stuffId) => {
  // 상품 기본 정보와 옳소/싫소 통계 조회
  const detail = await stuffRepository.findStuffDetailById(stuffId);

  if (!detail) {
    throw new Error('존재하지 않는 상품입니다.');
  }

  // 대표 리뷰 사진
  const bestReviewImage =
    await stuffRepository.findBestReviewImageByStuffId(stuffId);

  // 추천 조합 상위 2개
  const recommendedStuffs =
    await stuffRepository.findRecommendedStuffs(stuffId);

  // 하단 대표 리뷰
  const bestReview =
    await stuffRepository.findBestReviewByStuffId(stuffId);

  return {
    stuffId: detail.stuffId,
    stuffName: detail.stuffName,
    price: Number(detail.price || 0),

    brandId: detail.brandId,
    brandName: detail.brandName,

    bestReviewImageUrl: bestReviewImage
      ? bestReviewImage.imageUrl
      : null,

    likeCount: Number(detail.likeCount || 0),
    dislikeCount: Number(detail.dislikeCount || 0),
    koreanLikeCount: Number(detail.koreanLikeCount || 0),
    foreignLikeCount: Number(detail.foreignLikeCount || 0),

    recommendedStuffs: recommendedStuffs.map((stuff) => ({
      stuffId: stuff.stuffId,
      stuffName: stuff.stuffName,
      price: Number(stuff.price || 0),
      likeCount: Number(stuff.likeCount || 0),
      dislikeCount: Number(stuff.dislikeCount || 0),
    })),

    bestReview: bestReview
      ? {
          postId: bestReview.postId,
          content: bestReview.content,
          imageUrl: bestReview.imageUrl,
          createdAt: bestReview.createdAt,
          likeCount: Number(bestReview.likeCount || 0),
          dislikeCount: Number(bestReview.dislikeCount || 0),
          user: {
            userId: bestReview.userId,
            nickname: bestReview.nickname,
            profileImageUrl: bestReview.profileImageUrl,
          },
        }
      : null,
  };
};

// 상품 자동완성 검색
const searchStuffs = async (keyword) => {
  if (!keyword || !keyword.trim()) {
    return [];
  }

  const cleanKeyword = keyword.replace('@', '').trim();

  const stuffs = await stuffRepository.searchStuffsByName(cleanKeyword);

  return stuffs.map((stuff) => ({
    stuffId: stuff.stuffId,
    stuffName: stuff.stuffName,
    brandId: stuff.brandId,
  }));
};

// 상품 찾기 또는 생성
const findOrCreateStuff = async (stuffName) => {
  if (!stuffName || !stuffName.trim()) {
    throw new Error('상품명을 입력해주세요.');
  }

  const cleanStuffName = stuffName.replace('@', '').trim();

  const { stuff, created } = await stuffRepository.findOrCreateStuffByName(cleanStuffName);

  return {
    stuffId: stuff.stuffId,
    stuffName: stuff.stuffName,
    brandId: stuff.brandId,
    created,
  };
};


module.exports = {
  createStuff,
  updateStuff,
  deleteStuff,
  getStuffsByBrandId,
  getStuffDetail,
  searchStuffs,
  findOrCreateStuff,
};