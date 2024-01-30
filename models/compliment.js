const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = class Compliment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
        content:{
            type: DataTypes.STRING,
            allowNull: false
        }, 
        emotion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
          }
      }, {
        sequelize,
        underscored: false,
        modelName: 'compliment',
        tableName: 'compliments',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
      });
    }

    static associate(db) {
        db.Compliment.hasMany(db.Compliment, { as: 'compliments' });
    }
}
