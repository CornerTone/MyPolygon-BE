const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = class Compliment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
        content:{
            type: DataTypes.STRING,
            allowNull: false
        }
      }, {
        sequelize,
        underscored: false,
        modelName: 'comment',
        tableName: 'comments',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
      });
    }

    static associate(db) {
        db.Community.belongsTo(db.User);
        db.Comment.belongsTo(db.Community);
    }
}
