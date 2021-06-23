const configuration = require("./configs/configuration");
const connectDB = require("./configs/database");

const User = require("./models/User.model");

connectDB();

const createAccountAdmin = async () => {
  if ((await User.countDocuments()) === 0) {
    const user = new User({
      username: configuration().ADMIN_USERNAME,
      password: configuration().ADMIN_PASSWORD,
      displayname: "Bùi Tất Trung",
      email: "buitrungt@gmail.com",
      phoneNumber: "0396500575",
    });
    user.save();

    console.log(
      `Created account admin with username: ${configuration().ADMIN_USERNAME}`
    );
  }
};

createAccountAdmin();
