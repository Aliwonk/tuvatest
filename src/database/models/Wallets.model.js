const { Model, DataTypes, UUIDV1 } = require("sequelize");
const postgresDB = require("../db");

class Wallets extends Model {};

Wallets.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV1
    },
    balance: {
        type: DataTypes.DECIMAL(19,2),
        allowNull: false,
        defaultValue: 0.0
    },
    currency: {
        type: DataTypes.CHAR(13),
        allowNull: false,
        defaultValue: "RUB"
    }
}, {
    sequelize: postgresDB,
    modelName: "wallets"
});

module.exports = Wallets;