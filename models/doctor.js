var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var doctorSchema = new Schema({
  name: { type: String, required: [true, "The name is required"] },
  img: { type: String, required: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: "Hospital",
    required: [true, "The hospital's id is required"]
  }
});
module.exports = mongoose.model("Doctor", doctorSchema);
