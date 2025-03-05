const express = require("express");
const jwt = require("jsonwebtoken");
const guard = express.Router();
const uuid = require("uuid");

const enableAuthRoutes = ["pay"];

guard.use((req, res, next) => {
    const { headers } = req;
    const urlAuth = req.url.includes("/auth");

    try {
        const { authorization } = headers;
        if (authorization) {

            const typeAuth = authorization.substring(0, 6);
            const token = authorization.substring(7);

            if (typeAuth != "Bearer" || token == null) {
                res.status(403).send({ statusCode: 403, message: "Доступ невозможен" })
            } else {
                const dataToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
                res.locals.authicated = true;
                res.locals.id = dataToken.id;
            }

        } else {

            res.locals.authicated = false;  
            for (let i = 0; i < enableAuthRoutes.length; i++) {
                if (req.url.includes(enableAuthRoutes[i])) return res.status(403).send({ statusCode: 403, message: "Доступ запрещен" });
            }
        }

        next();
    } catch (error) {
        switch (error.message) {
            case "jwt expired":
                res.status(403).send({ statusCode: 403, message: "Токен истек" });
                break;
            case "jwt malformed":
                res.status(403).send({ statusCode: 403, message: "Токен не найден" });
                break;
            case "invalid signature":
                res.status(403).send({ statusCode: 403, message: "Токен испорчен" });
                break;
            default:
                res.status(500).send("Произошла ошибка на стороне сервера");
                break;
            }
        console.log("Ошибка в guard: " + error);
    }
});

module.exports = guard;