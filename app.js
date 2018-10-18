//Requires
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Initialization
var app = express();

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connection BBDD
mongoose.connection.openUri("mongodb://localhost:27017/hospitalDB", err => {
  if (err) throw err;

  console.log("Base de datos: \x1b[32m%s\x1b[0m", "online");
});

//Import Routes
var appRoutes = require("./routes/app");
var userRoutes = require("./routes/user");
var loginRoutes = require("./routes/login");

//Routes
app.use("/user", userRoutes);
app.use("/login", loginRoutes);
app.use("/", appRoutes);

//Listener
app.listen(3000, () => {
  console.log("Express server puerto 3000: \x1b[32m%s\x1b[0m", "online");
});
