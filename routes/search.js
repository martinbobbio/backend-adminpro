var express = require("express");
var app = express();

var User = require("../models/user");
var Hospital = require("../models/hospital");
var Doctor = require("../models/doctor");

// =======================================
// all search
// =======================================
app.get("/all/:search", (req, res) => {
  var search = req.params.search;
  var regex = new RegExp(search, "i");

  Promise.all([
    searchHospitals(regex),
    searchDoctors(regex),
    searchUsers(regex)
  ]).then(response => {
    res.status(200).json({
      ok: true,
      hospitals: response[0],
      doctors: response[1]
    });
  });
});

function searchHospitals(regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ name: regex })
      .populate("user", "name email")
      .exec((err, hospitals) => {
        if (err ? reject("Error to load hospitals", err) : resolve(hospitals));
      });
  });
}
function searchDoctors(regex) {
  return new Promise((resolve, reject) => {
    Doctor.find({ name: regex })
      .populate("user", "name email")
      .populate("hospital")
      .exec((err, doctors) => {
        if (err ? reject("Error to load hospitals", err) : resolve(doctors));
      });
  });
}
function searchUsers(regex) {
  return new Promise((resolve, reject) => {
    User.find({}, "name email role")
      .or([{ name: regex }, { email: regex }])
      .exec((err, users) => {
        if (err ? reject("Error to load hospitals", err) : resolve(users));
      });
  });
}

// =======================================
// search collection
// =======================================
app.get("/collection/:table/:search", (req, res) => {
  var search = req.params.search;
  var table = req.params.table;
  var regex = new RegExp(search, "i");
  var promise;

  switch (table) {
    case "users":
      promise = searchUsers(regex);
      break;
    case "doctors":
      promise = searchDoctors(regex);
      break;
    case "hospitals":
      promise = searchHospitals(regex);
      break;
    default:
      return res.status(400).json({
        ok: false,
        message: 'The types of search are users, doctors and hospitals',
        error: { message: 'Type of table/collection invalid' }
      });
  }

  promise.then(data => {
    res.status(200).json({
        ok: false,
        [table]: data
      });
  })
});

module.exports = app;
