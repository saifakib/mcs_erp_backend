const { findRoleInHR } = require("../services/hr/roles");
const { createResponse } = require("../utils/responseGenerator");

// check store admin
module.exports.checkStoreAdmin = async (req, res, next) => {
  try {
    const { role_id } = req.headers;
    console.log(role_id);
    if (!role_id) {
      res.json(
        createResponse(
          null,
          "You are not authorized to perform the operation",
          true
        )
      );
    } else {
      const { rows: result } = await findRoleInHR(5);
      const found = result[0];
      if (found.ROLE_ID === parseInt(role_id)) {
        return next();
      } else {
        res.json(
          createResponse(
            null,
            "You are not authorized to perform the operation",
            true
          )
        );
      }
    }
  } catch (err) {
    next(err);
  }
};

// check store officer
module.exports.checkStoreOfficer = async (req, res, next) => {
  try {
    const { role_id } = req.headers;
    if (!role_id) {
      return res.json(
        createResponse(
          null,
          "You are not authorized to perform the operation",
          true
        )
      );
    } else {
      const { rows: result } = await findRoleInHR(24);
      const found = result[0];
      if (found.ROLE_ID === parseInt(role_id)) {
        return next();
      } else {
        return res.json(
          createResponse(
            null,
            "You are not authorized to perform the operation",
            true
          )
        );
      }
    }
  } catch (err) {
    return next(err);
  }
};

// check both
module.exports.checkBoth = async (req, res, next) => {
  try {
    const { role_id } = req.headers;
    if (!role_id) {
      return res.json(
        createResponse(
          null,
          "You are not authorized to perform the operation",
          true
        )
      );
    } else {
      const found = [5, 24].includes(parseInt(role_id));
      if (found) {
        return next();
      } else {
        return res.json(
          createResponse(
            null,
            "You are not authorized to perform the operation",
            true
          )
        );
      }
    }
  } catch (err) {
    return next(err);
  }
};
