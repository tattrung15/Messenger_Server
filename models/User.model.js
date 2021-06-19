const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Requires username"],
      unique: [true, "Duplicate username"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Requires password"],
      select: false,
    },
    displayname: {
      type: String,
      required: [true, "Requires displayname"],
      trim: true,
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
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

userSchema.pre("findOneAndUpdate", function (next) {
  const update = { ...this.getUpdate() };

  if (update.password) {
    const hashPassword = bcrypt.hashSync(update.password, 10);

    update.password = hashPassword;
    this.setUpdate(update);
  }
  next();
});

module.exports = mongoose.model("User", userSchema, "User");
