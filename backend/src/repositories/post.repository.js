const Post = require('../models/post.model');
const Stuff = require('../models/stuff.model');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

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

 const findPostsByUserId = async (userId) => {
    // 함수 내부에 require가 중복 선언되어 있어도 실행은 되지만, 
    // 깔끔하게 상단에 선언되어 있다면 아래처럼 바로 쓰시면 됩니다.

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
            
            -- 카운트 (중복 방지를 위해 DISTINCT 필수)
            COUNT(DISTINCT c.comment_id) AS commentCount,
            COUNT(DISTINCT CASE WHEN i.reaction_type = 'LIKE' THEN i.interaction_id END) AS likeCount,
            COUNT(DISTINCT CASE WHEN i.reaction_type = 'DISLIKE' THEN i.interaction_id END) AS dislikeCount,
            COUNT(DISTINCT s.scrap_id) AS scrapCount
            
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.user_id
        LEFT JOIN stuffs st ON p.stuff_id = st.stuff_id
        LEFT JOIN brands b ON st.brand_id = b.brand_id
        
        -- 중복되던 Join들을 하나로 합쳤습니다.
        LEFT JOIN comments c ON p.post_id = c.post_id AND c.deleted_at IS NULL
        LEFT JOIN interactions i ON p.stuff_id = i.stuff_id AND i.deleted_at IS NULL
        LEFT JOIN post_scraps s ON p.post_id = s.post_id AND s.deleted_at IS NULL
        
        WHERE p.user_id = :userId AND p.deleted_at IS NULL
        
        -- GROUP BY는 SELECT에 있는 집계 함수 제외 모든 컬럼을 포함해야 안전합니다.
        -- 오타 방지를 위해 깔끔하게 정리했습니다.
        GROUP BY 
            p.post_id, u.user_id, st.stuff_id, b.brand_id
            
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