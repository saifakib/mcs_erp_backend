const { createResponse } = require("../utils/responseGenerator");

// 404 not found error handle
const notFoundHandler = (req, res, next) => {
  next(createResponse(null, "Your request content was not found", true));
};

// Default error handler
const errorHandler = (error, req, res, next) => {
  if (error.data === null) {
    res.json(createResponse(error.data, error.message, true));
  } else {
    res.json(createResponse(null, "Server Error", true));
  }
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
