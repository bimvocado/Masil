const express = require('express');
const cors = require('cors');
const { port } = require('./src/config/env');

// 라우터
const userRouter = require('./src/routes/user.routes');
// 댓글
//const commentRouter = require('./src/routes/comment.routes');

// 게시글
const postRouter = require('./src/routes/post.routes')

// 상품
const stuffRouter = require('./src/routes/stuff.routes');


const sequelize = require('./src/config/db'); // DB 연결 설정 파일 경로 확인!
const User = require('./src/models/user.model'); // 유저 모델 불러오기 (중요!)
// 상호작용 - 옳소/싫소
const commentRouter = require('./src/routes/comment.routes');
const interactionRouter = require('./src/routes/interaction.routes');
const scrapRouter = require('./src/routes/scrap.routes');
const categoryRouter = require('./src/routes/category.routes');

// DB 연결 및 모델
const sequelize = require('./src/config/db');
const User = require('./src/models/user.model');
const Brand = require('./src/models/brand.model');
const Stuff = require('./src/models/stuff.model');
const Post = require('./src/models/post.model');
const Comment = require('./src/models/comment.model');
const Scrap = require('./src/models/scrap.model');
const Category = require('./src/models/category.model');

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

User.hasMany(Post, { foreignKey : 'userId' });
Post.belongsTo(User, { foreignKey : 'userId' });

User.hasMany(Interaction, { foreignKey: 'userId' });
Interaction.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Interaction, { foreignKey: 'postId' });
Interaction.belongsTo(Post, { foreignKey: 'postId' });

sequelize.sync({ alter: true }) // alter: true는 바뀐 설계도대로 테이블을 수정/생성함
  .then(() => {
    console.log('✅ 드디어 MySQL에 테이블이 생겼습니다!');
  })
  .catch((err) => {
    console.error('❌ 테이블 생성 실패. 이유는?:', err);
  });

const app = express();
app.use(cors());
app.use(express.json());

// 라우터 등록
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
// 상품/검색 관련 API 연결
app.use('/api/stuffs', stuffRouter);
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