const { Model, DataTypes, UUIDV1 } = require("sequelize");
const postgresDB = require("../db");
const QuestionOptions = require("./QuestionOptions.model");
const UserQuestions = require("./UserQuestions.model");

const TYPE_QUESTIONS = Object.freeze({
    ONE_TO_ONE: "ONE_TO_ONE", // ВОПРОС С ОДНИМ ОТВЕТОМ
    ONE_TO_MANY: "ONE_TO_MANY", // ВОПРОС С НЕСКОЛЬКИМ ОТВЕТОМ
    TRUE_OR_FALSE: "TRUE_OR_FALSE", // ВОПРОС ВЕРНО/НЕВЕРНО 
    SHORT_ANSWER: "SHORT_ANSWER", // ВОПРОС С КРАТКИМ ОТВЕТОМ
    MANY_TO_MANY: "MANY_TO_MANY", // ВОПРОС СООТВЕТСТВИЕ
    SEQUENCE: "SEQUENCE" // ВОПРОС ПОСЛЕДОВАТЕЛЬНОСТЬ
});

class Questions extends Model {};
Questions.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV1,
    }, 
    text: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["ONE_TO_ONE", "ONE_TO_MANY", "TRUE_OR_FALSE", "SHORT_ANSWER", "MANY_TO_MANY", "SEQUENCE"],
    },
    rating: {
        type: DataTypes.REAL,
        allowNull: false
    },
    difficulty: {
        type: DataTypes.REAL,
        allowNull: false
    },
    answer: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    sequelize: postgresDB,
    modelName: "questions",
});

Questions.hasMany(QuestionOptions, {
    as: "options",
    onDelete: "cascade",
});

Questions.hasOne(UserQuestions, {
    onDelete: "cascade"
});


module.exports = {
    Questions,
    TYPE_QUESTIONS
};
