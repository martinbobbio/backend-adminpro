var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var hospitalSchema = new Schema(
  {
    name: { type: String, required: [true, "The name is required"] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { collection: "hospitals" }
);
module.exports = mongoose.model("Hospital", hospitalSchema);
