const { Execute } = require("../../../utils/dynamicController");

/*------------- Get ------------*/
module.exports.postRequisitionInfo = () =>
  Execute(`INSERT INTO STR_REQUISITIONS`);
