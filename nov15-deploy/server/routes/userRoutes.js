const express = require("express");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
const auth = require("../middlewares/authMiddleware");
const EmailHelper = require("../utils/emailHelper");

const userRouter = express.Router();

// register a user

userRouter.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      success: true,
      message: "Registration Successfull. Please login to continue",
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.send({
        success: false,
        message: "User not found. Please register first",
      });
    }
    if (req.body.password !== user.password) {
      return res.send({
        success: false,
        message: "Password is incorrect",
      });
    }
    console.log("secret", process.env.JWT_SECRET);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("token", token);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
    });
    res.send({
      success: true,
      message: "Login Successful",
      data: token,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

userRouter.get("/get-current-user", auth, async (req, res) => {
  const user = await User.findById(req.body.userId).select("-password");
  res.send({
    success: true,
    data: user,
    message: "You are authorized to go to the protected route",
  });
});

const otpGenerator = function () {
  return Math.floor(100000 + Math.random() * 900000); // -> 100000 - 999999
};

userRouter.patch("/forgetpassword", async function (req, res) {
  try {
    if (req.body.email === undefined) {
      return res.status(401).json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();
    await EmailHelper("otp.html", user.email, { name: user.name, otp: otp });
    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

userRouter.patch("/resetpassword/:email", async function (req, res) {
  try {
    let resetDetails = req.body;
    // required fields are present or not
    if (!resetDetails.password || !resetDetails.otp) {
      return res.status(400).json({
        success: false,
        message: "Password and OTP are required",
      });
    }
    // search for the user with the email
    const user = await User.findOne({ email: req.params.email });
    // if user is not present
    if (user === null) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // if otp is expirerd
    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP is expired",
      });
    }
    // if otp is incorrect
    if (user.otp !== resetDetails.otp) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }
    user.password = resetDetails.password;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = userRouter;
