const { findRoleInHR } = require("../services/hr/roles");
const { createResponse } = require("../utils/responseGenerator");

// check it admin
module.exports.checkITAdmin = async (req, res, next) => {
  try {
    const { role_id } = req.headers;
    if (!role_id) {
      return res.json(createResponse(null,"You are not authorized to perform the operation",true));
    } else {
      const { rows: result } = await findRoleInHR(2);
      const found = result[0];
      if (found.ROLE_ID === parseInt(role_id)) {
        return next();
      } else {
        return res.json(createResponse(null,"You are not authorized to perform the operation",true));
      }
    }
  } catch (err) {
    next(err);
  }
};
