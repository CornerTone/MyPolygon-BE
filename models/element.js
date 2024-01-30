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
        },
        score: {
            type: DataTypes.INTEGER,
            defaultValue: 5
        },
        time: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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
        db.Element.belongsTo(db.User); // Element는 하나의 User에 속함
        db.Element.belongsTo(db.Polygon); // Element는 하나의 Polygon에 속함
    }
}
