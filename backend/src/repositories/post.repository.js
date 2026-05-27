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

// 사용자별 게시글 조회 (with 댓글 수, 좋아요/싫어요 카운트)
const findPostsByUserId = async (userId) => {
    const { QueryTypes } = require('sequelize');
    const sequelize = require('../config/db');

    const posts = await sequelize.query(`
        SELECT
            p.post_id AS postId,
            p.user_id AS userId,
            p.stuff_id AS stuffId,
            p.content AS content,
            p.image_url AS imageUrl,
            p.created_at AS createdAt,
            p.updated_at AS updatedAt,
            
            u.nickname AS nickname,
            u.profile_image_url AS profileImageUrl,
            
            st.stuff_name AS stuffName,
            st.price AS price,
            
            b.brand_id AS brandId,
            b.brand_name AS brandName,
            
            COUNT(DISTINCT c.comment_id) AS commentCount,
            COUNT(DISTINCT CASE WHEN i.reaction_type = 'LIKE' THEN i.interaction_id END) AS likeCount,
            COUNT(DISTINCT CASE WHEN i.reaction_type = 'DISLIKE' THEN i.interaction_id END) AS dislikeCount,
            COUNT(DISTINCT s.scrap_id) AS scrapCount
            
        FROM posts p
        
        LEFT JOIN users u ON p.user_id = u.user_id
        LEFT JOIN stuffs st ON p.stuff_id = st.stuff_id
        LEFT JOIN brands b ON st.brand_id = b.brand_id
        
        LEFT JOIN comments c ON p.post_id = c.post_id AND c.deleted_at IS NULL
        LEFT JOIN interactions i ON p.post_id = i.post_id AND i.deleted_at IS NULL
        LEFT JOIN scraps s ON p.post_id = s.post_id AND s.deleted_at IS NULL
        
        WHERE p.user_id = :userId AND p.deleted_at IS NULL
        
        GROUP BY
            p.post_id, p.user_id, p.stuff_id, p.content, p.image_url, p.created_at, p.updated_at,
            u.nickname, u.profile_image_url,
            st.stuff_name, st.price,
            b.brand_id, b.brand_name
            
        ORDER BY p.created_at DESC
    `, {
        replacements: { userId },
        type: QueryTypes.SELECT
    });
    
    return posts;
};

module.exports = {
    createPost,
    findPostById,
    updatePost,
    deletePost,
    findAllPosts,
    findPostsByUserId
}