const errorHandle = require("../middlewares/errorHandle");

const userRouter = require("./user.router");
const authRouter = require("./auth.router");

module.exports = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use(errorHandle);
};
