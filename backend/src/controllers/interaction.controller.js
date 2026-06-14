const interactionService = require('../services/interaction.service');
const ApiResponse = require('../utils/api.response.util');
const { ToggleInteractionReqDTO } = require('../dtos/interaction.dto');
const toggleInteraction = async (req, res, next) => {
  try {
    const { stuffId } = req.params;
    const { reactionType } = req.body;
 
    const userId = req.user.user_id || req.user.userId; 
    console.log("컨트롤러 userId 확인", userId); 

    const reqDTO = new ToggleInteractionReqDTO(userId, stuffId, reactionType);
    const interactionResult = await interactionService.toggleInteraction(reqDTO);
console.log("최종 보낼 데이터:", interactionResult); // 👈 이게 터미널에 어떻게 찍히는지 보세요!
    res.status(200).json(ApiResponse.success(200, '상호작용 처리 완료', interactionResult));
  } catch (error) {
    next(error);
  }
};
const getInteractionStats = async (req, res, next) => {
  try {
    const { stuffId } = req.params;
    const userId = (req.user?.user_id || req.user?.userId) ?? null;

    const statsResult = await interactionService.getInteractionStats(Number(stuffId), userId);

    return res.status(200).json(ApiResponse.success(200, '통계 데이터 로드 완료', statsResult));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  toggleInteraction,
  getInteractionStats,
};