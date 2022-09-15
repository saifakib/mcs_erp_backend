const { Execute } = require("../../../utils/dynamicController");

/*-------------------------------- SELECT --------------------------------*/

const getRequisitionStatusCount = () => Execute(`
SELECT 
SUM(CASE WHEN REQUISTATUS = 0 THEN 1 ELSE 0 END) AS PENDINGCOUNT, 
SUM(CASE WHEN REQUISTATUS = 1 THEN 1 ELSE 0 END) AS APPROVEDCOUNT,
SUM(CASE WHEN REQUISTATUS = 2 THEN 1 ELSE 0 END) AS STOREAPPRUVALCOUNT,
SUM(CASE WHEN REQUISTATUS = 3 THEN 1 ELSE 0 END) AS DONECOUNT
FROM STR_REQUISITIONS`);


/*--------------------------------END SELECT --------------------------------*/


module.exports = { getRequisitionStatusCount }
