const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Requires username"],
      unique: [true, "Duplicate username"],
    },
    password: {
      type: String,
      required: [true, "Requires password"],
      select: false,
    },
    displayname: {
      type: String,
      required: [true, "Requires displayname"],
    },
    isOnline: {
      type: Boolean,
      required: [true, "Requires isOnline"],
      default: false,
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email does not match",
      ],
    },
    phoneNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", userSchema, "User");
