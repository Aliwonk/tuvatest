const { Model, DataTypes } = require("sequelize");
const postgresDB = require("../db");

class QuestionOptions extends Model { };

QuestionOptions.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    text: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    sequence: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    correct: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    }
}, { 
    sequelize: postgresDB,
    modelName: "question-options" ,
    timestamps: false,
});


module.exports = QuestionOptions;