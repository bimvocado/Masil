const express = require('express');
const cors = require('cors');
const { port } = require('./src/config/env');

// 라우터
// 유저
const userRouter = require('./src/routes/user.routes');
// 댓글
const commentRouter = require('./src/routes/comment.routes');


const app = express();

app.use(express.json());
app.use(cors());

// 라우터 등록 
app.use('/api/users', userRouter);
app.use('/api/posts', commentRouter);
app.use('/api/comments', commentRouter);


// 서버 상태 확인
app.get('/', (req, res) => {
  res.json({ success: true, message: '마실 서버 실행 중' });
});

app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});