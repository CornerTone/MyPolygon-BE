const express = require('express');
const Sequelize = require('sequelize');
const path = require('path');
const { sequelize } = require('./models');
const authRouter = require('./routes/auth');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

const app = express();
const port = 3000;

app.set('port', port); // 포트 설정

app.get('/', (req, res) => res.json('Hello world'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use('/api/auth', authRouter);

app.use((req, res, next) => {
  return res.json({
    success: false,
    message: `${req.method} ${req.url} 라우터가 없습니다.`
  })
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
