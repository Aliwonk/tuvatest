const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const jsonParse = express.json();
const payRoute = express.Router();
const Users = require("../database/models/Users.model");
const Wallets = require("../database/models/Wallets.model");

payRoute.post("/wallet", jsonParse, async (req, res) => {
    const { body, headers } = req;

    try {

        const user = await Users.findByPk(res.locals.id);

        if (user) {
            const wallet = await user.getWallet();
            const idKey = crypto.randomUUID();
            const basicAuth = Buffer.from(process.env.YOOKASSA_SHOP_ID + ":" + process.env.YOOKASSA_SECRET_KEY).toString("base64");
            const reqYookassa = new Request(process.env.YOOKASSA_API + "/payments");

            const resYookassa = await fetch(reqYookassa, {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${basicAuth}`,
                    "Content-Type": "application/json",
                    "Idempotence-Key": idKey,
                },
                body: JSON.stringify({
                    amount: {
                        value: body.amount.value,
                        currency: body.amount.currency,
                    },
                    payment_method_data: {
                        type: "bank_card",
                    },
                    confirmation: {
                        type: "redirect",
                        return_url: `http://${process.env.HOST}:${process.env.PORT}/profile`
                    },
                    capture: true,
                    metadata: {
                        wallet_id: wallet.dataValues.id,
                        user_id: user.dataValues.id,
                        amount: body.amount.value,
                    },
                    description: `Пополнения кошелька на сумму ${body.amount.value}. ID пользователя: ${user.dataValues.id}`
                })
            });
            const resultYookassa = await resYookassa.json();
            const { confirmation } = resultYookassa;

            if (confirmation) {
                res.send({
                    statusCode: 301,
                    redirect: {
                        url: confirmation.confirmation_url
                    }
                });

                const timerCheckPay = setInterval(() => {
                    checkStatusPay();
                    console.log(" Проверка платежа: " + resultYookassa.id);
                }, 5000);

                function checkStatusPay() {
                    const reqCheckPay = new Request(process.env.YOOKASSA_API + `/payments/${resultYookassa.id}`)
                    fetch(reqCheckPay, {
                        headers: {
                            "Authorization": `Basic ${basicAuth}`,
                            "Content-Type": "application/json",
                        }
                    }).then((resCheckPay) => resCheckPay.json())
                        .then((resultCheckPay) => {
                            if (resultCheckPay.status == "succeeded") {
                                clearInterval(timerCheckPay);
                                wallet.update({ balance: Wallets.sequelize.literal(`balance + ${resultCheckPay.amount.value}`) });
                                console.log("Кошелек пополнен");
                            }
                        });
                }
            }
        }
    } catch (error) {
        console.log(error);
    }


});

module.exports = payRoute;