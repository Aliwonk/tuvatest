require("dotenv").config();
const https = require("https");
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const guard = require("./src/routes/guard");
const postgresDB = require("./src/database/db");
const homeRoute = require("./src/routes/home.route");
const authRoute = require("./src/routes/auth.route");
const userRoute = require("./src/routes/user.route");
const payRoute = require("./src/routes/pay.route");
const questionRoute = require("./src/routes/question.route");
const testRoute = require("./src/routes/test.route");


app.use(function (req, res, next) {
    if (req.protocol === 'http') {
        res.redirect(301, `https://${req.headers.host}${req.url}`);
    } else {
        next();
    }
});

app.use(cors({
    origin: "http://localhost:8080",
}));
app.use(guard);

// ФАЙЛЫ VUE КЛИЕНТА 

app.use(express.static(__dirname + "/client/dist"));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});


// API СЕРВЕРА

app.use("", homeRoute);
app.use("/auth", authRoute);
app.use("/pay", payRoute);
app.use("/user", userRoute);
app.use("/question", questionRoute);
app.use("/test", testRoute);

// HTTPS OPTIONS

const HTTPS_OPTIONS = {
    key: fs.readFileSync('certificate.key'),
    cert: fs.readFileSync('certificate.crt'),
    ca: fs.readFileSync('certificate_ca.crt')
}

postgresDB.sync({ alter: true }).then(result => {
    https.createServer(HTTPS_OPTIONS, app)
        .listen(process.env.PORT_SSL, () => {
            console.log(`СЕРВЕР РАБОТАЕТ НА ПОРТУ ${process.env.PORT_SSL}`);
            console.log(`ДОСТУПЕН ПО АДРЕСУ https://tuvatest.ru`);
        });

})
    .catch(err => {
        console.log("Ошибка подключения к базе данных: " + err);
    });
