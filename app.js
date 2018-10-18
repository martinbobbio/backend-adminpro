//Requires
var express = require("express");
var mongoose = require("mongoose");

//Initialization
var app = express();

//Connection BBDD
mongoose.connection.openUri(
  "mongodb://localhost:27017/hospitalDB",
  (err, resp) => {
    if (err) throw err;

    console.log("Base de datos: \x1b[32m%s\x1b[0m", "online");
  }
);

//Routes
app.get("/", (req, res, next) => {
  res.status(200).json({
    ok: true
  });
});

//Listener
app.listen(3000, () => {
  console.log("Express server puerto 3000: \x1b[32m%s\x1b[0m", "online");
});
