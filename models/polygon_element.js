const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = class PolygonElement extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
        name: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
      }, {
        sequelize,
        underscored: false,
        modelName: 'polygon_element',
        tableName: 'polygon_elements',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false
      });
    }

    static associate(db) {
        db.Element.belongsTo(db.Polygon); // Element는 하나의 Polygon에 속함
    }
}