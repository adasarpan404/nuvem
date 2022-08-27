const mongoose = require("mongoose");
const { isEmail } = require("validator");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " please tell us your name"],
    },
    email: {
      type: String,
      required: [true, "please provide your email"],
      unique: true,
      validate: [isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "please provide password"],
      minlength: 8,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);
