const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const Users = require("../database/models/Users.model");
const jsonParse = express.json();
const userRoute = express.Router();

userRoute.post("/profile", async (req, res) => {
    const { headers } = req;

    try {
        const { id } = res.locals;

        const user = await Users.findByPk(id);
        const wallet = await user.getWallet();

        res.status(200).send({
            statusCode: 200, data: {
                surname: user.dataValues.surname,
                name: user.dataValues.name,
                patronimyc: user.dataValues.patronimyc || "",
                balance: wallet.dataValues.balance,
                currency: wallet.dataValues.currency,
            }
        });
    } catch (error) {
        console.log("Ошибка в маршруте профиля: " + error);
    }
});

module.exports = userRoute;