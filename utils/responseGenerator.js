module.exports.createResponse = (data, message = null, error = false) => {
  return {
    data,
    message,
    error,
  };
};
