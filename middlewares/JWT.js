const { sign, verify } = require("jsonwebtoken");
const { createResponse } = require("../utils/responseGenerator");
require("dotenv").config();

module.exports.createTokens = (user_id, employe_id) => {
  const accessToken = sign(
    {
      user_id: user_id,
      employe_id: employe_id,
    },
    process.env.JWT_SECRET, {
    expiresIn: "8hr",
  }
  );
  return accessToken;
};

module.exports.validateToken = (req, res, next) => {
  try {
    //console.log(req.cookies["token"])
    //const accessToken = req.cookies["token"];

    const { authorization } = req.headers;
    if (authorization === "") {
      return res.json(createResponse(null, "User not Authenticated!", true));
    } else {
      const accessToken = authorization.split(" ");
      if(accessToken[0] === 'Bearer') {
        if (!accessToken[1]) {
          return res.json(createResponse(null, "User not Authenticated!", true));
        } else {
          const validToken = verify(accessToken[1], process.env.JWT_SECRET);
          
          if (validToken) {
            req.user = validToken.user_id;
            req.employe_id = validToken.employe_id;
            req.token = validToken;
            return next();
          }
        }
      } else {
        return res.json(createResponse(null, "User not Authenticated!", true));
      }
    }
  } catch (error) {
    return res.json(createResponse(null, `${error.message}`, true));
  }
};

