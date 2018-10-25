var express = require("express");
var mdAuth = require("../middlewares/auth");

var app = express();

var Hospital = require("../models/hospital");

// =======================================
// Get hospitals
// =======================================
app.get("/", (req, res) => {
  var since = req.query.since || 0;
  since = Number(since);

  Hospital.find({})
    .skip(since)
    .limit(5)
    .populate("user", "name email")
    .exec((err, hospitals) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: "Error in hospitals",
          errors: err
        });
      }

      Hospital.count({}, (count) => {
        res.status(200).json({
          ok: true,
          total: count,
          hospitals
        });
      });
    });
});

// =======================================
// Update hospitals
// =======================================
app.put("/:id", mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error in search hospitals",
        errors: err
      });
    }
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        message: "The hospital not exists",
        errors: { message: "Hospitals not exists" }
      });
    }

    hospital.name = body.name;
    hospital.user = req.user._id;

    hospital.save((err, hospital) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Error in update hospital",
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospital
      });
    });
  });
});

// =======================================
// Create hospital
// =======================================
app.post("/", mdAuth.verifyToken, (req, res) => {
  var body = req.body;
  var hospital = new Hospital({
    name: body.name,
    user: req.user._id
  });

  hospital.save((err, hospital) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: "Error in create hospital",
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      hospital
    });
  });
});

// =======================================
// Delete hospital
// =======================================
app.delete("/:id", mdAuth.verifyToken, (req, res) => {
  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error in delete hospital",
        errors: err
      });
    }
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        message: "The hospital not exists",
        errors: { message: "Hospital not exists" }
      });
    }

    res.status(200).json({
      ok: true,
      hospital
    });
  });
});

module.exports = app;
