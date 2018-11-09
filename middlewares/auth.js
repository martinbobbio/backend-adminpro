var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

exports.verifyToken = function(req, res, next) {
  var token = req.query.token;

  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: "Incorrect token",
        errors: err
      });
    }
    req.user = decoded.user;
    next();
  });
};

exports.verifyAdmin = function(req, res, next) {

  var user = req.user;

  if(user.role === 'ADMIN_ROLE'){
    next();
    return;
  }else{
    if (err) {
      return res.status(401).json({
        ok: false,
        message: "Incorrect token - Not an admin",
        errors: { message: 'Not is an admin, cant do it' }
      });
    }
  }
};

exports.verifyEqualUser = function(req, res, next) {

  var user = req.user;
  var id = req.params.id;

  if(user.role === 'ADMIN_ROLE' || user._id === id){
    next();
    return;
  }else{
    if (err) {
      return res.status(401).json({
        ok: false,
        message: "Incorrect token - Not an admin or equal user",
        errors: { message: 'Not is an admin or equal user' }
      });
    }
  }
};
