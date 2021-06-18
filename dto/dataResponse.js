module.exports.ResponseEntity = class ResponseEntity {
  statusCode;
  message;
  result;

  constructor(statusCode = 400, message = "error", result = {}) {
    this.statusCode = statusCode;
    this.message = message;
    this.result = result;
  }
};

module.exports.HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.Message = {
  SUCCESS: "success",
  ERROR: "error",
  NO_CONTENT: "No content",
};
