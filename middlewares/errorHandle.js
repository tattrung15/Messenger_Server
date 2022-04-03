const configuration = require("../configs/configuration");
const { ResponseEntity, HttpStatus, Message } = require("../dto/dataResponse");

const errorHandle = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (configuration().NODE_ENV === "development") {
    console.log(err.message);
  }

  if (err.name === "CastError") {
    const message = `Resource not found with id: ${err.value}`;
    error = new ResponseEntity(HttpStatus.NOT_FOUND, message);
  }

  if (err.code === 11000) {
    const message = `Duplicate value`;
    error = new ResponseEntity(HttpStatus.BAD_REQUEST, message);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ResponseEntity(HttpStatus.BAD_REQUEST, message);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new ResponseEntity(HttpStatus.UNAUTHORIZED, message);
  }
  if (err.name === "JsonWebTokenError") {
    const message = err.message;
    error = new ResponseEntity(HttpStatus.UNAUTHORIZED, message);
  }

  const statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || Message.ERROR;

  return res.status(statusCode).json(new ResponseEntity(statusCode, message));
};

module.exports = errorHandle;
