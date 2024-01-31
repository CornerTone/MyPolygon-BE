const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = class Element extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
        name: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
        },
        questions: {
            type: DataTypes.JSON,
            allowNull: false
        }
      }, {
        sequelize,
        underscored: false,
        modelName: 'element',
        tableName: 'elements',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
      });
    }

    static associate(db) {
        db.Element.belongsToMany(db.User, { through: 'UserElement', as: 'users' });
        // db.Element.belongsTo(db.Polygon); // Element는 하나의 Polygon에 속함
    }
}
