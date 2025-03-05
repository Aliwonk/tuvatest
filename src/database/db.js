const Sequelize = require("sequelize");
const postgresDB = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
    dialect: "postgres",
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    logging: false
});

module.exports = postgresDB;