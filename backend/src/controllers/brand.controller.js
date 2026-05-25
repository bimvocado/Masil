const brandService = require('../services/brand.service');

const {
  CreateBrandReqDTO,
  UpdateBrandReqDTO,
} = require('../dtos/brand.dto');

// 브랜드 생성
const createBrand = async (req, res, next) => {
  try {
    const { brandName, logoUrl, category } = req.body;

    const createBrandReqDTO = new CreateBrandReqDTO(
      brandName,
      logoUrl,
      category
    );

    const result = await brandService.createBrand(createBrandReqDTO);

    return res.status(201).json({
      success: true,
      message: '브랜드 생성 성공',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// 브랜드 수정
const updateBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const { brandName, logoUrl, category } = req.body;

    const updateBrandReqDTO = new UpdateBrandReqDTO(
      brandName,
      logoUrl,
      category
    );

    const result = await brandService.updateBrand(
      brandId,
      updateBrandReqDTO
    );

    return res.status(200).json({
      success: true,
      message: '브랜드 수정 성공',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// 브랜드 삭제
const deleteBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;

    const result = await brandService.deleteBrand(brandId);

    return res.status(200).json({
      success: true,
      message: '브랜드 삭제 성공',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
};