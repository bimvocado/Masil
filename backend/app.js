const express = require('express');
const cors = require('cors');
const { port } = require('./src/config/env');
const userRouter = require('./src/routes/user.routes');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users', userRouter);


app.get('/', (req, res) => {
  res.json({ success: true, message: '마실 서버 실행 중' });
});

app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});

