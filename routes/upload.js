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
  if (validTypes.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      message: "Invalid type",
      type: extensionFile,
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
    User.findById(id, (err,user) => {

      if(!user) HttpNotFound("User", res);
      if(err) HttpErrorServer("User", res, err);
      
      var pathOld = "./uploads/user/" + user.img;
      if (fs.existsSync(pathOld)) {
        fs.unlink(pathOld, (err) => {
          if (err) throw err;
          console.log(`${pathOld} was deleted`);
        });
      }
      user.img = nameFile;
      user.save((err, userNew) => {
        if(err) HttpErrorServer("User", res, err);
        userNew.password = "SECRET";
        HttpSuccess("User", userNew, res);
      });
    });
  }

  if (type === "doctor") {
    Doctor.findById(id, (err,doctor) => {

      if(!doctor) HttpNotFound("Doctor", res);
      if(err) HttpErrorServer("Doctor", res, err);

      var pathOld = "./uploads/doctor/" + doctor.img;
      if (fs.existsSync(pathOld)) {
        fs.unlink(pathOld, (err) => {
          if (err) throw err;
          console.log(`${pathOld} was deleted`);
        });
      }
      doctor.img = nameFile;
      doctor.save((err, doctorNew) => {
        if(err) HttpErrorServer("Doctor", res, err);
        HttpSuccess("Doctor", doctorNew, res);
      });
    });
  }

  if (type === "hospital") {
    Hospital.findById(id, (err,hospital) => {
      
      if(!hospital) HttpNotFound("Hospital", res);
      if(err) HttpErrorServer("Hospital", res, err);

      var pathOld = "./uploads/hospital/" + hospital.img;
      if (fs.existsSync(pathOld)) {
        fs.unlink(pathOld, (err) => {
          if (err) throw err;
          console.log(`${pathOld} was deleted`);
        });
      }
      hospital.img = nameFile;
      hospital.save((err, hospitalNew) => {
        if(err) HttpErrorServer("Hospital", res, err);
        HttpSuccess("Hospital", hospitalNew, res);
      });
    });
  }
}

function HttpNotFound(entityText, res){
  return res.status(400).json({
    ok: false,
    message: `${entityText} not exists`,
    errors: { message: `${entityText} not exists` }
  });
}

function HttpErrorServer(entityText, res, err){
  return res.status(500).json({
    ok: false,
    message: `Error in search ${entityText}`,
    errors: err
  });
}

function HttpSuccess(entityText, entity, res){
  return res.status(200).json({
    ok: true,
    message: `${entityText} image updated`,
    entity
  });
}




module.exports = app;
