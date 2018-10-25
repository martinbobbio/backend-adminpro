var express = require("express");
var app = express();
var User = require("../models/user");
var Doctor = require("../models/doctor");
var Hospital = require("../models/hospital");
var fileUpload = require("express-fileupload");
var fs = require("fs");

app.use(fileUpload());

app.put("/:type/:id", (req, res) => {
  var type = req.params.type;
  var id = req.params.id;

  var validExtensions = ["png", "jpg", "gif", "jpeg"];
  var validTypes = ["hospital", "user", "doctor"];
  
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: "No select nothing",
      errors: { message: "You must select an image" }
    });
  }

  var file = req.files.image;
  var nameFile = file.name.split(".");
  var extensionFile = nameFile[nameFile.length - 1];

  if (validExtensions.indexOf(extensionFile) < 0) {
    return res.status(400).json({
      ok: false,
      message: "Invalid extension",
      errors: {
        message: "The extensions valid are " + validExtensions.join(", ")
      }
    });
  }
  if (validTypes.indexOf(extensionFile) < 0) {
    return res.status(400).json({
      ok: false,
      message: "Invalid type",
      errors: { message: "The type valid are " + validTypes.join(", ") }
    });
  }

  var fullNameFile = `${id}-${new Date().getMilliseconds()}.${extensionFile}`;

  var path = `./uploads/${type}/${fullNameFile}`;

  file.mv(path, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error al mover archivo",
        errors: err
      });
    }

    uploadByType(type, id, fullNameFile, res);
  });
});

function uploadByType(type, id, nameFile, res) {
  if (type === "user") {
    User.findById(id, (user) => {
      if(!user){
        return res.status(500).json({
          ok: false,
          message: "User not exists",
          errors: { message: "User not exists" }
        });
      }
      var pathOld = "./uploads/user/" + user.img;
      if (fs.existsSync(pathOld)) fs.unlink(pathOld);
      user.img = nameFile;
      user.save((userNew) => {
        userNew.password = "SECRET";
        return res.status(200).json({
          ok: true,
          message: "User image updated",
          user: userNew
        });
      });
    });
  }
  if (type === "doctor") {
    Doctor.findById(id, (doctor) => {
      if(!doctor){
        return res.status(500).json({
          ok: false,
          message: "Doctor not exists",
          errors: { message: "Doctor not exists" }
        });
      }
      var pathOld = "./uploads/doctor/" + doctor.img;
      if (fs.existsSync(pathOld)) fs.unlink(pathOld);
      doctor.img = nameFile;
      doctor.save((doctorNew) => {
        return res.status(200).json({
          ok: true,
          message: "Doctor image updated",
          user: doctorNew
        });
      });
    });
  }
  if (type === "hospital") {
    Hospital.findById(id, (hospital) => {
      if(!hospital){
        return res.status(500).json({
          ok: false,
          message: "Hospital not exists",
          errors: { message: "Hospital not exists" }
        });
      }
      var pathOld = "./uploads/hospital/" + hospital.img;
      if (fs.existsSync(pathOld)) fs.unlink(pathOld);
      hospital.img = nameFile;
      hospital.save((hospitalNew) => {
        return res.status(200).json({
          ok: true,
          message: "Hospital image updated",
          user: hospitalNew
        });
      });
    });
  }
}

module.exports = app;
