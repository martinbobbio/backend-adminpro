var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var Schema = mongoose.Schema;
var rolesValid = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

var userSchema = new Schema({
  name: { type: String, required: [true, "The name is required"] },
  email: { type: String, required: [true, "The email is required"], unique:true, },
  password: { type: String, required: [true, "The password is required"] },
  img: { type: String, required: false },
  role: { type: String, required: false, default: 'USER_ROLE', enum:rolesValid },
  google: { type:Boolean, default:false }
});
userSchema.plugin(uniqueValidator, {message: '{PATH} The email is unique'});

module.exports = mongoose.model('user', userSchema);