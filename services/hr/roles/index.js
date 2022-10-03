const { Execute } = require("../../../utils/dynamicController");

// find role in hr
module.exports.findRoleInHR = (role_id) =>
  Execute(`
  select role_id, employe_id from hrm.users where role_id = ${Number(
    role_id
  )}`);
