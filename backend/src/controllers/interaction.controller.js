const interactionService = require('../services/interaction.service');
const ApiResponse = require('../utils/ApiResponse');
const { ToggleInteractionReqDTO } = require('../dtos/interaction.dto');

const toggleInteraction = async (req, res, next) => {
  try {
    const { stuffId } = req.params;
    const { reactionType } = req.body;
    const userId = req.user.user.id;

    const reqDTO = new ToggleInteractionReqDTO(userId, stuffId, reactionType);

    const interactionResult = await interactionService.toggleInteraction(reqDTO);

    res.status(200).json(ApiResponse.success(200, '상호작용이 성공적으로 처리되었습니다.', interactionResult));
  } catch (error) {
    next(error);
  }
};

const getInteractionStats = async (req, res, next) => {
  try {
    const { stuffId } = req.params;

    const statsResult = await interactionService.getInteractionStats(Number(stuffId));

    return res.status(200).json(ApiResponse.success(200, '통계 데이터를 성공적으로 불러왔습니다.', statsResult));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleInteraction,
  getInteractionStats,
};