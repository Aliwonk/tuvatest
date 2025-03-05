const express = require("express");
const { Questions } = require("../database/models/Questions.model");
const UserQuestions = require("../database/models/UserQuestions.model");
const QuestionOptions = require("../database/models/QuestionOptions.model");
const testRoute = express.Router();
const jsonParse = express.json();

// АЛГОРИТМ ФОРМИРОВАНИЕ ВОПРОСОВ

function generateTest(questions, idUser = null, countQuestion = 5) {
    const test = []; // МАСССИВ ДЛЯ ВОПРОСОВ С БОЛЬШИМ ШАНСОМ
    const totalWeight = questions.reduce((sum, q) => sum + q.dataValues.rating * q.dataValues.difficulty, 0); // ОБЩИЙ СЧЕТ ШАНСОВ ВСЕХ ВОПРОСОВ.

    while (test.length < countQuestion) {
        const randomChance = Math.random(); // СЛУЧАЙНОЕ ДРОБНОЕ ЧИСЛО ОТ 0 ДО 1
        let cumulative = 0; // ДЛЯ НАКОПЛЕНИЯ ВЕРОЯТНОСТИ

        for (let i = 0; i < questions.length; i++) {
            const userQueston = questions[i].dataValues["user-question"];

            if (idUser && userQueston) {
                cumulative += (userQueston.dataValues.rating * userQueston.dataValues.difficulty) / totalWeight;
            } else {
                cumulative += (questions[i].dataValues.rating * questions[i].dataValues.difficulty) / totalWeight; // НАКАПЛИВАЕМ ВЕРОЯТНОСТЬ, ЧТОБЫ У ВСЕХ ВОПРОСОВ БЫЛ ШАНС ПОПАСТЬ В ТЕСТ
            }

            if (randomChance <= cumulative) {

                if (idUser && userQueston) {
                    questions[i].rating = questions[i].dataValues["user-question"].rating;
                    questions[i].difficulty = questions[i].dataValues["user-question"].difficulty;

                    test.push(questions[i]);
                } else {
                    test.push(questions[i]);
                }

                questions.splice(i, 1); // УДАЛЯЕМ ВЫБРАННЫЙ ВОПРОС ИЗ ОБЩЕГО МАССИВА
                break;
            }

        }
    }

    return test;
}

testRoute.post("/create", jsonParse, (req, res) => {
    const { body } = req;

    console.log(body);
});

testRoute.post("/train", jsonParse, async (req, res) => {
    try {
        const { authicated, id } = res.locals;
        const { params } = req.body;
        let option = () => {
            if (params && params.subjects) {
                return {
                    subjectId: params.subjects
                };
            }
            return null;
        }

        const questions = await Questions.findAll({
            where: option(),
            attributes: {
                exclude: ["groupId", "answer", "createdAt", "updatedAt"],
            },
            include: [
                {
                    as: "options", model: QuestionOptions,
                    attributes: ["id", "text", "correct"]
                },
                { model: UserQuestions }
            ]
        });

        if (questions.length == 0) return res.status(200).send({ statusCode: 200, questions });

        if (!authicated) {
            const test = generateTest(questions);
            res.status(200).send({ statusCode: 200, questions: test });
        } else {
            const test = generateTest(questions, id);
            res.status(200).send({ statusCode: 200, questions: test });
        }
    } catch (error) {
        console.log("Ошибка на маршруте /test/train " + error);
        res.status(500).send({ message: "Произошла ошибка на стороне сервера" });
    }
});

testRoute.post("/train-finish", jsonParse, async (req, res) => {
    const { body } = req;

    try {
        const { authicated, id } = res.locals;
        const { answer } = body;
        const result = [];

        for (let i = 0; i < answer.length; i++) {
            const question = await Questions.findByPk(answer[i].question, {
                attributes: {
                    exclude: ["groupId", "createdAt", "updatedAt"]
                },
                include: {
                    as: "options",
                    model: QuestionOptions,
                    attributes: {
                        exclude: ["questionId"]
                    }
                }
            });

            const options = await question.getOptions();
            const getOption = options.find((opt) => answer[i].option === opt.dataValues.id);
            const userQuestion = await UserQuestions.findByPk(question.dataValues.id);

            if (getOption.dataValues.correct) {
                if (authicated) {
                    let downgrade = (question.dataValues.rating - question.dataValues.difficulty) / 10;
                    if (!userQuestion) {
                        await UserQuestions.create({
                            id: question.dataValues.id,
                            rating: question.dataValues.rating - downgrade,
                            difficulty: question.dataValues.difficulty,
                            userId: id,
                            questionId: question.dataValues.id
                        });
                    } else {
                        downgrade = (userQuestion.dataValues.rating - userQuestion.dataValues.difficulty) / 10;
                        userQuestion.update({
                            rating: userQuestion.dataValues.rating - downgrade,
                        });
                    }

                }

                delete question.dataValues.difficulty;
                delete question.dataValues.rating;

                result.push({
                    correct: true,
                    question
                });

            } else {

                if (authicated) {
                    if (!userQuestion) {
                        await UserQuestions.create({
                            id: question.dataValues.id,
                            rating: question.dataValues.rating + 10,
                            difficulty: question.dataValues.difficulty,
                            userId: id,
                            questionId: question.dataValues.id
                        });
                    } else {
                        userQuestion.update({
                            rating: userQuestion.dataValues.rating + 10,
                        });
                    }

                }

                delete question.dataValues.difficulty;
                delete question.dataValues.rating;

                result.push({
                    correct: false,
                    question
                });
            }
        }

        res.status(200).send({ statusCode: 200, result });

    } catch (error) {
        console.log("Ошибка на маршруте /test/train-finish " + error);
        res.status(500).send({ message: "Произошла ошибка на стороне сервера" });
    }
});

module.exports = testRoute;