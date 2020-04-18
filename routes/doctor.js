var express = require("express");
var mdAuth = require("../middlewares/auth");

var app = express();

var Doctor = require("../models/doctor");

// =======================================
// Get doctors
// =======================================
app.get("/", (req, res) => {
  var since = req.query.since || 0;
  since = Number(since);

  Doctor.find({})
    .skip(since)
    .limit(5)
    .populate("user", "name email")
    .populate("hospital", "name email")
    .exec((err, doctors) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error in doctors",
          errors: err
        });
      }

      Doctor.countDocuments({}, (err, count) => {
        res.status(200).json({
          ok: true,
          total: count,
          doctors
        });
      });
    });
});

// =======================================
// Get doctor
// =======================================
app.get("/:id", (req, res) => {
  var id = req.params.id;
  Doctor.findById(id)
    .populate("user", "name img email")
    .populate("hospital")
    .exec((err, doctor) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error in search doctor",
          errors: err
        });
      }
      if (!doctor) {
        return res.status(400).json({
          ok: false,
          message: "The doctor not exists "+id,
          errors: { message: "The doctor with this id not exists" }
        });
      }
      res.status(200).json({
        ok: true,
        doctor
      });
    });
});

// =======================================
// Update doctors
// =======================================
app.put("/:id", mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Doctor.findById(id, (err, doctor) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error in search doctors",
        errors: err
      });
    }
    if (!doctor) {
      return res.status(400).json({
        ok: false,
        message: "The doctor not exists",
        errors: { message: "Doctor not exists" }
      });
    }

    doctor.name = body.name;
    doctor.hospital = body.hospital;
    doctor.user = req.user._id;

    doctor.save((err, doctor) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error in update doctor",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        doctor
      });
    });
  });
});

// =======================================
// Create doctor
// =======================================
app.post("/", mdAuth.verifyToken, (req, res) => {
  var body = req.body;
  var doctor = new Doctor({
    name: body.name,
    user: req.user._id,
    hospital: body.hospital
  });

  doctor.save((err, doctor) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "Error in create doctor",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      doctor
    });
  });
});

// =======================================
// Delete doctor
// =======================================
app.delete("/:id", mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;

  Doctor.findByIdAndRemove(id, (err, doctor) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error in delete doctor",
        errors: err
      });
    }
    if (!doctor) {
      return res.status(400).json({
        ok: false,
        message: "The doctor not exists",
        errors: { message: "Doctor not exists" }
      });
    }

    res.status(200).json({
      ok: true,
      doctor
    });
  });
});

module.exports = app;
