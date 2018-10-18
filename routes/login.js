var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

var User = require("../models/user");

app.post("/", (req, res) => {
  var body = req.body;

  User.findOne({ email: body.email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error in search users",
        errors: err
      });
    }
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "Invalid credentials - email",
        errors: err
      });
    }
    if(bcrypt.compareSync(body.password,user.password)){
        return res.status(400).json({
            ok: false,
            message: "Invalid credentials - password",
            errors: err
          });
    }

    user.password = 'SECRET';
    var token = jwt.sign({user}, SEED,{expiresIn: 14400})

    res.status(200).json({
      ok: true,
      id: user._id,
      user,
      token,
      
    });
  });
});

module.exports = app;
