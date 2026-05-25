const stuffService = require('../services/stuff.service');

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


module.exports = {
  createStuff,
  updateStuff,
  deleteStuff,
};