const { getAllLogs } = require("../../services/audit_log");
const { createResponse } = require("../../utils/responseGenerator");

module.exports.getAllLogs = async (req, res, next) => {
  try {
    const { rows } = await getAllLogs();
    res.json(createResponse(rows));
  } catch (error) {
    next(error.message);
  }
};
