const { ExecuteHR } = require("../../../utils/hrDynamicController");

module.exports.updateUserPassword = (user, hashed) =>
  ExecuteHR(`UPDATE USERS SET PASSWORD = ${hashed} WHERE USER_ID = ${user}`);
