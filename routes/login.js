var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;
var app = express();
var User = require("../models/user");


//GOOGLE
var CLIENT_ID = require("../config/config").CLIENT_ID;
var { OAuth2Client } = require("google-auth-library");
var client = new OAuth2Client(CLIENT_ID);
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  //const userid = payload['sub'];

  return { 
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google:true
   }
}

// =======================================
// Auth Google
// =======================================
app.post("/google", (req, res) => {
  
  var token = req.body.token;
  var googleUser = await verify(token).catch((err =>{
    return res.status(403).json({
      ok: false,
      message: "Token no válido",
      errors: err
    });
  }));

  User.findOne({ email:googleUser.email }, (err,userDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        message: "Error in search users",
        errors: err
      });
    }
    if(userDB){
      if(userDB.google === false){
        //Requires Auth Normal
        return res.status(500).json({
          ok: false,
          message: "The user must use your auth normal",
          errors: err
        });
      }else{
        //Login User
        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });
        res.status(200).json({
          ok: true,
          id: userDB._id,
          user: userDB,
          token
        });
      }
    }else{
      //Create User
      var user = new User();
      user.name = googleUser.name;
      user.email = googleUser.email;
      user.img = googleUser.img;
      user.google = true;
      user.password = 'NOT PASSWORD';

      user.save((userDB)=>{
        var token = jwt.sign({ user: userDB }, SEED, { expiresIn: 14400 });
        res.status(200).json({
          ok: true,
          id: userDB._id,
          user: userDB,
          token
        });
      })

    }
  });

  return res.status(200).json({
    ok: false,
    message: "OK",
    googleUser
  });
});

// =======================================
// Auth
// =======================================
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
    if (bcrypt.compareSync(body.password, user.password)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid credentials - password",
        errors: err
      });
    }

    user.password = "SECRET";
    var token = jwt.sign({ user }, SEED, { expiresIn: 14400 });

    res.status(200).json({
      ok: true,
      id: user._id,
      user,
      token
    });
  });
});

module.exports = app;
