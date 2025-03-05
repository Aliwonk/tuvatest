const { Model, DataTypes, UUIDV1 } = require("sequelize");
const postgresDB = require("../db");
const { Questions } = require("./Questions.model");

class QuestionSubjects extends Model { };

QuestionSubjects.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV1
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    }
}, {
    sequelize: postgresDB,
    modelName: "question-subjects"
});

QuestionSubjects.hasMany(Questions, {
    foreignKey: "subjectId",
    as: "questions",
    onDelete: "cascade",
});

Questions.belongsTo(QuestionSubjects, {
    foreignKey: "subjectId",
    as: "subject",
});

module.exports = QuestionSubjects;