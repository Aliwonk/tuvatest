const { Model, DataTypes, UUIDV1 } = require("sequelize");
const postgresDB = require("../db");
const Wallets = require("./Wallets.model");
const UserQuestions = require("./UserQuestions.model");

class Users extends Model {};
Users.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: UUIDV1,
    },
    surname: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    patronimyc: {
        type: DataTypes.STRING(30),
        defaultValue: null,
    },
    hash_password: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    number_phone: {
        type: DataTypes.CHAR(13),
        allowNull: false,
        unique: true,
    }
}, {
    sequelize: postgresDB,
    modelName: "users"
});

Users.hasOne(Wallets, {
    onDelete: "cascade"
});

Users.hasMany(UserQuestions, {
    onDelete: "cascade"
});


module.exports = Users;