const { Model, DataTypes } = require("sequelize");
const postgresDB = require("../db");

class UserQuestions extends Model { };

UserQuestions.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    rating: {
        type: DataTypes.REAL,
        allowNull: false,
    },
    difficulty: {
        type: DataTypes.REAL,
        allowNull: false
    }
}, {
    sequelize: postgresDB,
    modelName: "user-questions"
});


module.exports = UserQuestions;