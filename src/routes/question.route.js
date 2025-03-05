const express = require("express");
const { Questions, TYPE_QUESTIONS } = require("../database/models/Questions.model");
const QuestionOptions = require("../database/models/QuestionOptions.model");
const QuestionSubjects = require("../database/models/QuestionSubjects.model");
const questionRoute = express.Router();
const jsonParse = express.json();


questionRoute.post("/create", jsonParse, async (req, res) => {
    const { body } = req;

    try {
        const typeQuestion = Object.values(TYPE_QUESTIONS)[body.type - 1];
        const questions = await Questions.create({
            text: body.text,
            type: typeQuestion,
            rating: body.rating,
            difficulty: body.difficulty
        });

        if (body.group) {
            const questionGroup = await QuestionSubjects.findByPk(body.group);
            questions.update({ groupId: questionGroup.dataValues.id });
        }


        if (typeQuestion == "ONE_TO_ONE" || typeQuestion == "ONE_TO_MANY") {
            body.options.forEach(answer => {
                QuestionOptions.create({
                    text: answer.text,
                    correct: answer.correct,
                    questionId: questions.dataValues.id
                });
            });
        } else if (typeQuestion == "SEQUENCE") {
            body.options.forEach(answer => {
                QuestionOptions.create({
                    text: answer.text,
                    sequence: answer.sequence,
                    questionId: questions.dataValues.id
                })
            });
        }

        res.status(201).send({ statusCode: 201, message: "Вопрос создан" });
    } catch (error) {
        console.log("Ошибка на маршруте /question/create: " + error);
        res.status(500).send({ message: "Произошла ошибка на стороне сервера" });
    }
});

questionRoute.post("/list/create", jsonParse, async (req, res) => {
    const { body } = req;
    try {
        for (let i = 0; i < body.length; i++) {
            if (body[i].subject) {
                const subject = await QuestionSubjects.findByPk(body[i].subject);
                const typeQuestion = Object.values(TYPE_QUESTIONS)[body[i].type - 1];
                const question = await Questions.create({
                    text: body[i].text,
                    type: typeQuestion,
                    rating: body[i].rating,
                    difficulty: body[i].difficulty,
                    subjectId: subject.dataValues.id
                });

                if (typeQuestion == "ONE_TO_ONE" || typeQuestion == "ONE_TO_MANY") {
                    body[i].options.forEach(option => {
                        QuestionOptions.create({
                            text: option.text,
                            correct: option.correct,
                            questionId: question.dataValues.id
                        });
                    });
                } else if (typeQuestion == "SEQUENCE") {
                    body[i].options.forEach(option => {
                        QuestionOptions.create({
                            text: option.text,
                            sequence: option.sequence,
                            questionId: question.dataValues.id
                        })
                    });
                }
            }
        }

        res.status(201).send({ statusCode: 201, message: "Вопросы созданы" });
    } catch (error) {
        console.log("Ошибка на маршруте /question/list/create: " + error);
        res.status(500).send({ message: "Произошла ошибка на стороне сервера" });
    }
});

questionRoute.post("/get/:id", jsonParse, async (req, res) => {
    try {
        const idQuestion = req.params.id;
        const question = await Questions.findByPk(idQuestion, {
            attributes: {
                exclude: ["subjectId"],
            },
            include: [
                {
                    model: QuestionOptions,
                    as: "options",
                },
                {
                    model: QuestionSubjects,
                    as: "subject",
                    attributes: ["id", "name"]
                }
            ],
        });

        if (!question) return res.status(404).send({ statusCode: 404, message: "Вопрос не найден" });

        res.status(200).send({ statusCode: 200, question });
    } catch (error) {
        console.log("Ошибка на маршруте /question/get: " + error);
        res.status(500).send({ message: "Произошла ошибка на стороне сервера" });
    }
});

questionRoute.post("/get-all", jsonParse, async (req, res) => {
    try {
        const questions = await Questions.findAll({
            attributes: {
                exclude: ["subjectId"],
            },
            include: [
                {
                    model: QuestionOptions,
                    as: "options",
                },
                {
                    model: QuestionSubjects,
                    as: "subject",
                    attributes: ["id", "name"]
                }
            ],
        });
        res.status(200).send({ statusCode: 200, questions });
    } catch (error) {
        console.log("Ошибка на маршруте /question/get-all: " + error);
        res.status(500).send({ message: "Произошла ошибка на стороне сервера" });
    }
});

// QUESTIONS GROUP

questionRoute.post("/subject/create", jsonParse, async (req, res) => {
    const { body } = req;

    try {
        const questionSubject = await QuestionSubjects.create(body);
        res.status(201).send({ statusCode: 201, message: "Тема создан" });
    } catch (error) {
        console.log("Ошибка на маршруте /question/subject/create: " + error);
        res.status(500).send({ message: "Произошла ошибка на стороне сервера" });
    }
});

questionRoute.post("/subject/get/:id", async (req, res) => {
    const { params } = req;
    try {
        const id = params.id
        const questionSubject = await QuestionSubjects.findByPk(id);
        res.status(200).send({ statusCode: 200, subject: questionSubject });
    } catch (error) {
        console.log("Ошибка на маршруте /question/subject/get: " + error);
        res.status(500).send({ message: "Произошла ошибка на стороне сервера" });
    }
});

questionRoute.post("/subject/get-all", async (req, res) => {
    try {
        const questionSubject = await QuestionSubjects.findAll()
        res.status(200).send({ statusCode: 200, subjects: questionSubject });
    } catch (error) {
        console.log("Ошибка на маршруте /question/subject/get-all: " + error);
        res.status(500).send({ message: "Произошла ошибка на стороне сервера" });
    }
});

module.exports = questionRoute;