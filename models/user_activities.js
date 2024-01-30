const { DataTypes, Model, Sequelize } = require('sequelize');

module.exports = class UserActivity extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                category: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },
                duration_minutes: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                activity_date: {
                    type: DataTypes.DATE,
                    allowNull: false
                }
            },
            {
                sequelize,
                modelName: 'user_acttivity',
                tableName: 'user_activities',
                timestamps: false // timestamps를 사용하지 않을 경우
            }
        );
    }

    static associate(db) {
        // UserActivity 모델과 다른 모델 간의 관계를 정의할 수 있음
        db.UserActivity.belongsTo(db.User);
    }
};
