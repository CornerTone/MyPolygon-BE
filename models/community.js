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
        modelName: 'community',
        tableName: 'communities',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
      });
    }

    static associate(db) {
        db.Community.belongsTo(db.User);
        db.Community.belongsToMany(db.Element, { through: 'CommunityElement', as: 'categories' });
        db.Community.hasMany(db.Comment, { as: 'community_comments'});
    }
}
