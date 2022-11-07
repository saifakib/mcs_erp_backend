const { sign, verify } = require("jsonwebtoken");
const { createResponse } = require("./responseGenerator");
require("dotenv").config();

module.exports.createTokens = (user_id, employe_id) => {
  const accessToken = sign(
    {
      user_id: user_id,
      employe_id: employe_id,
    },
    process.env.JWT_SECRET
  );
  return accessToken;
};

module.exports.validateToken = (req, res, next) => {
  try {
    const accessToken = req.cookies["token"];
    if (!accessToken) {
      res.json(createResponse(null, "User not Authenticated!", true));
    } else {
      const validToken = verify(accessToken, process.env.JWT_SECRET);
      if (validToken) {
        req.user = validToken.user_id;
        req.employe_id = validToken.employe_id;
        next();
      }
    }
  } catch (error) {
    res.json(createResponse(null, `${error.message}`, true));
  }
};
