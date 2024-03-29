require('dotenv').config(); // dotenv 로드

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const Element = require('./element');
const PolygonElement = require('./polygon_element');
const Polygon = require('./polygon');
const User = require('./user');

const Community = require('./community');
const Comment = require('./comment');

const Compliment = require('./compliment');

const DailyInvestment = require('./dailyInvestment');
const WeeklyInvestment = require('./weeklyInvestment');


// 모델 정의
const db = {
    sequelize,
    Element: Element.init(sequelize),
    PolygonElement: PolygonElement.init(sequelize),
    Polygon: Polygon.init(sequelize),
    User: User.init(sequelize),
    Compliment: Compliment.init(sequelize),

    DailyInvestment: DailyInvestment.init(sequelize),
    WeeklyInvestment: WeeklyInvestment.init(sequelize),

    Community: Community.init(sequelize),
    Comment: Comment.init(sequelize)

};

// 관계 설정
Element.associate(db);
Polygon.associate(db);
User.associate(db);
Compliment.associate(db);
PolygonElement.associate(db);

DailyInvestment.associate(db);
WeeklyInvestment.associate(db);


Community.associate(db);
Comment.associate(db);


module.exports = db;
