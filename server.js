const express = require("express");
const helmet = require("helmet");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");
const jwt = require("jsonwebtoken");

const server = express();

server.use(helmet());
server.use(express.json());

server.use("/api", usersRouter);
server.use("/api", authRouter);

server.get('/', (req,res) => {
  res.status(200).send('Working Tokens!')
})

module.exports = server;