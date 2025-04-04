const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "partner"],
    required: true,
    default: "user",
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
