module.exports = function (err, req, res, next) {
  if (err) {
    let statusCode = 500;
    if (err.name == "ValidationError") {
      statusCode = 400;
    }
    const errorPaths = Object.keys(err.errors || {});
    const errorMessages = errorPaths.map(
      (path) => err.errors[path].properties.message
    );
    const errorMessage = errorMessages.join(", ") || err.message;
    res.json(createResponse(null, errorMessage, true));
  }
};
