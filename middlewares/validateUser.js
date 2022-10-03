const { createResponse } = require("../utils/responseGenerator");

module.exports.validateUser = (req, res, next) => {
  const accessToken = req.cookies["SSID"];
  if (!accessToken)
    return res.json(createResponse(null, "User not authenticated!"));

  try {
    req.user = accessToken;
    return next();
  } catch (err) {
    return res.json(createResponse(null, `${err.message}`, true));
  }
};
