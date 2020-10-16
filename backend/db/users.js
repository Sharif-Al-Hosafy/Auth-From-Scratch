const mongoose = require("mongoose");
 
const userSchema = mongoose.Schema({
  email: {
      type:String,
      unique: true
  },
  username: String,
  password:String
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;