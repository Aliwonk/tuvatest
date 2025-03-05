const express = require("express");
const jsonParse = express.json();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRoute = express.Router();
const Users = require("../database/models/Users.model");
const Wallets = require("../database/models/Wallets.model");

// МАРШРУТ РЕГИСТРАЦИИ

authRoute.post("/registration", jsonParse, async (req, res) => {

    try {
        const { body } = req;

        const keys = Object.keys(body);
        for (let i = 0; i < keys.length; i++) {
            const element = body[keys[i]];
            if (keys[i] !== "patronimyc" && element.length == 0) return res.status(400).send({ statusCode: 400, message: `Параметр ${keys[i]} пустой` });
        }

        const hashPassword = bcrypt.hashSync(body.password, bcrypt.genSaltSync(10));
        const user = await Users.create({
            surname: body.surname,
            name: body.name,
            hash_password: hashPassword,
            patronimyc: body.patronimyc,
            email: body.email,
            number_phone: body.number_phone,
        });

        const wallet = await Wallets.create({
            balance: 0.0,
            currency: "RUB"
        });

        const userToken = jwt.sign({
            id: user.dataValues.id,
            surname: user.dataValues.surname,
            name: user.dataValues.name,
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: Number(process.env.JWT_EXPIRES_IN),
        }); 

        user.setWallet(wallet)
            .catch((err) => {
                console.log("Ошибка на этапе создания кошелька: " + err);
            });

        res.status(201).send({
            statusCode: 201,
            data: {
                token: userToken,
                exp: process.env.JWT_EXPIRES_IN,
            }
        });

    } catch (error) {
        if (error.parent && error.parent.code == "23505") return res.status(409).send({ statusCode: 409, message: "Пользователь существует" });
        console.log("Ошибка в маршруте регистрации: " + error);
    }
});

// МАРШРУТ АВТОРИЗАЦИИ

authRoute.post("/login", jsonParse, async (req, res) => {
    const { body } = req;

    try {
        const keys = Object.keys(body);

        for (let i = 0; i < keys.length; i++) {
            const element = body[keys[i]];
            if (element.length == 0) return res.status(400).send({ statusCode: 400, message: `Параметр ${keys[i]} пустой` });
        }

        const user = await Users.findOne({
            where: { email: body.login }
        });

        if (!user) return res.status(404).send({ statusCode: 404, message: "Пользователь не найден" });
        const checkPassword = bcrypt.compareSync(body.password, user.dataValues.hash_password.toString());
        if (!checkPassword) return res.status(401).send({ statusCode: 401, message: "Неверный логин или пароль" });

        const userToken = jwt.sign({
            id: user.dataValues.id,
            surname: user.dataValues.surname,
            name: user.dataValues.name,
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: Number(process.env.JWT_EXPIRES_IN),
        });

        res.status(200).send({
            statusCode: 200,
            data: {
                token: userToken,
                exp: process.env.JWT_EXPIRES_IN,
            }
        });

    } catch (error) {
        console.log("Ошибка в маршруте логина: " + error);
        res.status(500).send({
            statusCode: 500,
            message: "Произошла ошибка на стороне сервера"
        });
    }

});

module.exports = authRoute;