
const { createResponse } = require('../utils/responseGenerator')

// 404 not found error handle
const notFoundHandler = (req, res, next) => {
  next(createResponse(404, "Your request content was not found", true))
}

// Default error handler
const errorHandler = (error, req, res, next) => {
  if(error.data == 404) {
    res.json(createResponse(error.data,  error.message, true))
  } else {
    res.json(createResponse(500,"Server Error", true))
  }
}


module.exports = {
  notFoundHandler,
  errorHandler
}
