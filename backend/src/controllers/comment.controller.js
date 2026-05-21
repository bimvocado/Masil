const commentService = require('../services/comment.service');

const getComments = async (req, res, next) => {
    try {
        const {postID} = req.params;
        const comments = await commentService.getComments(postID);
        return res.status(200).json({
            success: true,
            message: '댓글 조회 성공',
            data: comments
        });
    } catch (error) {
        next(error);
    }
};