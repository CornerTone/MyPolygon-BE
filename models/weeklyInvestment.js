
const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = class WeeklyInvestment extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {

                year: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                week: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                category: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                totalTimeInvested: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                startDate: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                endDate: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                user_id:{
                    type: DataTypes.INTEGER,
                    allowNull: false
                }
            },
            {
                sequelize, // Sequelize 인스턴스 전달
                modelName: 'WeeklyInvestment', // 모델 이름
                tableName: 'weekly_investments', // 테이블 이름
                timestamps: true, // timestamps 설정 (생성일 및 수정일)
                underscored: true, // 카멜케이스 대신 스네이크 케이스 사용
                paranoid: true // soft delete 설정
            }
        );
    }   

    static associate(db) {
        db.WeeklyInvestment.belongsTo(db.User);    }

}
