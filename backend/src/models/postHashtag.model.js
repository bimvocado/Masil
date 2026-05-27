const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PostHashtag = sequelize.define('PostHashtag', {
    postId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    hashtagId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true 
        
        // 같은 게시글에 같은 해시태그 중복 저장 막음, 두 ID가 복합키!
    }
}, {
    tableName: 'postHashtags',   
    timestamps: true,  // createdAt, updatedAt 자동 관리      
    paranoid: true,    // deletedAt 자동 관리    
    underscored: true, // db에 위 3가지 생성 (ex created_at)
})

module.exports = PostHashtag;