const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = class TimeInvestment extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                category: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                year: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                week: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                timeInvested: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                startDate: {
                    type: DataTypes.DATE,
                    allowNull: true
                },
                endDate: {
                    type: DataTypes.DATE,
                    allowNull: true
                },
                activityDate: { //해당 날짜
                    type: DataTypes.DATE,
                    allowNull: true
                }
                
            },
            {
                sequelize,
                modelName: 'TimeInvestment',
                tableName: 'time_investments',
                timestamps: false
            }
        );
    }

    static associate(db) {
        db.TimeInvestment.belongsTo(db.User);
    }
}

