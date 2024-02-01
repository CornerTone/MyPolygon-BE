// models/dailyInvestment.js
const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = class DailyInvestment extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {

                category: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                timeInvested: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                activityDate: {
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
                    modelName: 'DailyInvestment', // 모델 이름
                    tableName: 'daily_investments', // 테이블 이름
                    timestamps: true, // timestamps 설정 (생성일 및 수정일)
                    underscored: true, // 카멜케이스 대신 스네이크 케이스 사용
                    paranoid: true // soft delete 설정
            
            }
        );
    }   

    static associate(db) {

        db.DailyInvestment.belongsTo(db.User);}

}
