const Post = require('../models/post.model');
const Stuff = require('../models/stuff.model');

// 게시글 생성
const createPost = async (postData) => {
    return await Post.create(postData);
}

// 게시글 전체 조회
const findAllPosts = async () => {
    return await Post.findAll({
        order: [['createdAt', 'DESC']],
    });
};

// 게시글 개별 조회
const findPostById = async (postId) => {
    return await Post.findByPk(postId);
}

// 게시글 수정
const updatePost = async (post, updateData) => {
    return await post.update(updateData);
}

// 게시글 삭제 (soft delete), 게시글 DELETE가 아니라 deletedAt 값을 채워줌!
const deletePost = async (post) => {
    return await post.destroy();
}

module.exports = {
    createPost,
    findPostById,
    updatePost,
    deletePost,
    findAllPosts
}