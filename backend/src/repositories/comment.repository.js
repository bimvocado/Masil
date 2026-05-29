const Comment = require('../models/comment.model');
const User = require('../models/user.model');

const findCommentsByPostId = async (postId) => {
  return await Comment.findAll({
    where: { postId },
    include: [{
      model: User,
      attributes: ['nickname', 'profile_image_url'] // 프사,닉네임
    }],
    order: [['createdAt', 'DESC']]
  });
};

const createComment = async (postId, userId, text) => {
  return await Comment.create({ postId, userId, text });
};

const updateComment = async (commentId, text) => {
  const comment = await Comment.findOne({ where: { commentId } });
  if (!comment) return null;
  comment.text = text;
  return await comment.save();
};
const deleteComment = async (commentId) => {
  // 💡 1. 타입을 숫자로 강제 변환 (BigInt 대응)
  const id = Number(commentId);
  console.log("🚀 레포지토리 삭제 시도 ID:", id);

  // 💡 2. where 대신 findByPk 사용 (가장 정확함)
  const comment = await Comment.findByPk(id);
  
  if (!comment) {
    console.log("❌ DB에서 댓글을 찾지 못했습니다. ID:", id);
    return null;
  }
  
  // 💡 3. paranoid 옵션을 무시하고 진짜 지우기
  return await comment.destroy({ force: true });
};

module.exports = { findCommentsByPostId, createComment, updateComment, deleteComment };