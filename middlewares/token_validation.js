const jwt = require("jsonwebtoken");
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      // Remove Bearer from string
      token = token.slice(7);
      jwt.verify(token, 'b', (err, decoded) => {
        if (err) {
          console.log("database connection errr");
          return res.json({
            success: 0,
            message: "Invalid Token..."
          });
        } else {
          req.decoded = decoded;
          console.log(req.decoded)
          next();
        }
      });
    } else {
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User"
      });
    }
  }
};
