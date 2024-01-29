require('dotenv').config(); // dotenv 로드

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const Element = require('./element');
const Polygon = require('./polygon');
const User = require('./user');

// 모델 정의
const db = {
    sequelize,
    Element: Element.init(sequelize),
    Polygon: Polygon.init(sequelize),
    User: User.init(sequelize),
};

// 관계 설정
Element.associate(db);
Polygon.associate(db);
User.associate(db);

module.exports = db;
