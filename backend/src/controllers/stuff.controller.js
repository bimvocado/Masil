const stuffService = require('../services/stuff.service');
const ApiResponse = require('../utils/api.response.util');

const {
  CreateStuffReqDTO,
  UpdateStuffReqDTO,
} = require('../dtos/stuff.dto');



// 상품 생성 API
const createStuff = async (req, res, next) => {
  try {

    // 요청 body 값 꺼내기
    const {
      brandId,
      stuffName,
      price
    } = req.body;


    // DTO 생성
    const createStuffReqDTO =
      new CreateStuffReqDTO(
        brandId,
        stuffName,
        price
      );


    // service 호출
    const result =
      await stuffService.createStuff(
        createStuffReqDTO
      );


    // 응답 반환
    return res.status(201).json({
      success: true,
      message: '상품 생성 성공',
      data: result,
    });

  } catch (error) {
    next(error);
  }
};




// 상품 수정 API
const updateStuff = async (req, res, next) => {
  try {

    // URL parameter
    const { stuffId } = req.params;

    // 요청 body
    const {
      stuffName,
      price,
      isDiscontinued
    } = req.body;


    // DTO 생성
    const updateStuffReqDTO =
      new UpdateStuffReqDTO(
        stuffName,
        price,
        isDiscontinued
      );


    // service 호출
    const result =
      await stuffService.updateStuff(
        stuffId,
        updateStuffReqDTO
      );


    // 응답 반환
    return res.status(200).json({
      success: true,
      message: '상품 수정 성공',
      data: result,
    });

  } catch (error) {
    next(error);
  }
};




// 상품 삭제 API
const deleteStuff = async (req, res, next) => {
  try {

    // URL parameter
    const { stuffId } = req.params;


    // service 호출
    const result =
      await stuffService.deleteStuff(
        stuffId
      );


    // 응답 반환
    return res.status(200).json({
      success: true,
      message: '상품 삭제 성공',
      data: result,
    });

  } catch (error) {
    next(error);
  }
};


 // 브랜드별 상품 목록 조회
const getStuffsByBrandId = async (req, res, next) => {
  try {
    const { brandId } = req.params;

    const {
      sort = 'LATEST',
      page = 0,
      size = 10,
    } = req.query;

    const result = await stuffService.getStuffsByBrandId(
      brandId,
      sort,
      page,
      size
    );

    return res.status(200).json({
      success: true,
      message: '브랜드별 상품 목록 조회 성공',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// 상품 상세 페이지 조회
const getStuffDetail = async (req, res, next) => {
  try {
    const { stuffId } = req.params;

    const result = await stuffService.getStuffDetail(stuffId);

    return res.status(200).json({
      success: true,
      message: '상품 상세 조회 성공',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// 상품 자동완성 검색
const searchStuffs = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    const result = await stuffService.searchStuffs(keyword);

    return res.status(200).json(
      ApiResponse.success(200, '상품 자동완성 검색 성공', result)
    );
  } catch (error) {
    next(error);
  }
};

// 상품 찾기 또는 생성
const findOrCreateStuff = async (req, res, next) => {
  try {
    const { stuffName } = req.body;

    const result = await stuffService.findOrCreateStuff(stuffName);
    
    return res.status(200).json(
      ApiResponse.success(200, '상품 확인 성공', result)
    );
  } catch (error) {
    next(error);
  }
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