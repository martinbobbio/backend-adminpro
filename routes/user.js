var express = require("express");
var bcrypt = require("bcryptjs");
var mdAuth = require('../middlewares/auth');

var app = express();

var User = require("../models/user");

// =======================================
// Get users
// =======================================
app.get("/", (req, res, next) => {
  User.find({}, "name email img role").exec((err, users) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error in users",
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      users
    });
  });
});

// =======================================
// Update users
// =======================================
app.put("/:id",mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  User.findById(id, (err, user) => {
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
        message: "The user not exists",
        errors: { message: "User not exists" }
      });
    }

    user.name = body.name;
    user.email = body.email;
    user.role = body.role;

    user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error in update users",
          errors: err
        });
      }

      user.password = "SECRET";

      res.status(200).json({
        ok: true,
        user
      });
    });
  });
});

// =======================================
// Create users
// =======================================
app.post("/",mdAuth.verifyToken ,(req, res) => {
  var body = req.body;
  var user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "Error in create users",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      user,
      userCreator:req.user
    });
  });
});

// =======================================
// Delete users
// =======================================
app.delete("/:id",mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;

  User.findByIdAndRemove(id, (err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error in delete users",
        errors: err
      });
    }
    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "The user not exists",
        errors: { message: "User not exists" }
      });
    }

    res.status(200).json({
      ok: true,
      user
    });
  });
});

module.exports = app;
