const express = require("express");
const path = require("path");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

//Load Config
dotEnv.config({ path: "./config/config.env" });
const {errorHandler}=require('./middleware/Errors');

//Database Connection
connectDB();

const app = express();

//Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//static folder
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use("/users", require("./routes/Users"));
app.use("/wallet", require("./routes/Wallet"));
app.use("/orders", require("./routes/Order"));

//error controller
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running ... on port : ${PORT}`));
