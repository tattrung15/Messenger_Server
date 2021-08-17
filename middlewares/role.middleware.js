const { ResponseEntity, HttpStatus } = require("../dto/dataResponse");

module.exports.allowUserRouter = (req, res, next) => {
  const { userId } = req.params;

  if (userId !== req.user._id.toString()) {
    return next(new ResponseEntity(HttpStatus.FORBIDDEN, "Forbidden"));
  }

  next();
};
