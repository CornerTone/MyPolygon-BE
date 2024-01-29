require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
module.exports = {
  development: {
    username: 'root',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'mypolygon',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: "root",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "mypolygon",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: 'root',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'mypolygon',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  },
};

