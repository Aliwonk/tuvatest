const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const jsonParse = express.json();
const homeRoute = express.Router();
const Users = require("../database/models/Users.model");

homeRoute.post("", async (req, res) => {
});

module.exports = homeRoute;