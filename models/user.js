const { DataTypes, Model, Sequelize } = require('sequelize');
const Element = require('./element');
const Polygon = require('./polygon');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
      return super.init({
        nickname: {
            type: DataTypes.STRING,
            allowNull: false
          },
          phone_number: {
            type: DataTypes.STRING,
            allowNull: false
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false
          },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
          }
      }, {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false // created_at, updated_at 필드 추가되지 않도록 함 
      });
    }
    static associate(db) {
        db.User.hasMany(db.Element, { as: 'elements' });
        db.User.hasMany(db.Polygon, { as: 'polygons' });
    }
}


