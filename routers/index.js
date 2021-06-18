const errorHandle = require("../middlewares/errorHandle");
const userRouter = require("./user.router");

module.exports = (app) => {
  app.use("/api/users", userRouter);
  app.use(errorHandle);
};
