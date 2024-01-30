const express = require('express');
const Sequelize = require('sequelize');
const path = require('path');
const { sequelize } = require('./models');

const authRouter = require('./routes/auth');
const polygonRouter = require('./routes/polygon');
const elementRouter = require('./routes/element');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

sequelize.sync({ force: true }) // true 면 데이터베이스 재생성, false면 데이터베이스 변하지 않음 => true로 db모두 지우고 false로 바꿔서 디비 초기화로 사용중..
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
app.use('/api/polygon',polygonRouter);
app.use('/api/element', elementRouter);

app.use((req, res, next) => {
  return res.json({
    success: false,
    message: `${req.method} ${req.url} 라우터가 없습니다.`
  })
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
