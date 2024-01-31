const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = class Polygon extends Sequelize.Model {
    static init(sequelize) {
      return super.init({
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        grade: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
      }, {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'polygon',
        tableName: 'polygons',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        timestamps: false
      });
    }

    static associate(db) {
        db.Polygon.hasMany(db.PolygonElement, { as: 'elements' });
        db.Polygon.belongsTo(db.User); 
    }
}


