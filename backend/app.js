const express = require('express');
const cors = require('cors');
const { port } = require('./src/config/env');

// 라우터
const userRouter = require('./src/routes/user.routes');
const postRouter = require('./src/routes/post.routes');
const stuffRouter = require('./src/routes/stuff.routes');
const commentRouter = require('./src/routes/comment.routes');
const interactionRouter = require('./src/routes/interaction.routes');
const scrapRouter = require('./src/routes/scrap.routes');
const categoryRouter = require('./src/routes/category.routes');
const authRoutes = require('./src/routes/auth.route');

// DB 연결 및 모델
const sequelize = require('./src/config/db');
const User = require('./src/models/user.model');
const Brand = require('./src/models/brand.model');
const Stuff = require('./src/models/stuff.model');
const Post = require('./src/models/post.model');
const Comment = require('./src/models/comment.model');
const Scrap = require('./src/models/scrap.model');
const Category = require('./src/models/category.model');
const Interaction = require('./src/models/interaction.model');
const Hashtag = require('./src/models/hashtag.model');
const PostHashtag = require('./src/models/postHashtag.model');

// 관계 설정
Brand.hasMany(Stuff, { foreignKey: 'brandId' });
Stuff.belongsTo(Brand, { foreignKey: 'brandId' });
Stuff.hasMany(Post, { foreignKey: 'stuffId' });
Post.belongsTo(Stuff, { foreignKey: 'stuffId' });
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Scrap, { foreignKey: 'userId' });
Scrap.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Scrap, { foreignKey: 'postId' });
Scrap.belongsTo(Post, { foreignKey: 'postId' });
User.hasMany(Category, { foreignKey: 'userId' });
Category.belongsTo(User, { foreignKey: 'userId' });
Category.hasMany(Scrap, { foreignKey: 'categoryId' });
Scrap.belongsTo(Category, { foreignKey: 'categoryId' });
User.hasMany(Interaction, { foreignKey: 'userId' });
Interaction.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Interaction, { foreignKey: 'postId' });
Interaction.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(PostHashtag, { foreignKey: 'postId' });
PostHashtag.belongsTo(Post, { foreignKey: 'postId'});
Hashtag.hasMany(PostHashtag, { foreignKey: 'hashtagId' });
PostHashtag.belongsTo(Hashtag, { foreignKey: 'hashtagId' });

sequelize.sync({ alter: true })
  .then(() => console.log('MySQL 테이블 생성/수정 완료'))
  .catch((err) => console.error('테이블 생성 실패:', err));

const app = express();
app.use(cors());
app.use(express.json());

// 라우터 등록
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/stuffs', stuffRouter);
app.use('/api/auth', authRoutes);
app.use('/api/posts', commentRouter);
app.use('/api/comments', commentRouter);
app.use('/api/interactions', interactionRouter);
app.use('/api/scraps', scrapRouter);
app.use('/api/users', categoryRouter);

// 서버 상태 확인
app.get('/', (req, res) => {
  res.json({ success: true, message: '마실 서버 실행 중' });
});

app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});
