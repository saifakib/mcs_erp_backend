const { Execute } = require("../../../utils/dynamicController");

/*-------------------------------- SELECT --------------------------------*/

const getRequisitionStatusCount = () => Execute(`
SELECT 
SUM(CASE WHEN REQUISTATUS = 0 AND PROFILEHRID !=0 THEN 1 ELSE 0 END) AS PENDINGCOUNT, 
SUM(CASE WHEN REQUISTATUS = 1 AND PROFILEHRID !=0 THEN 1 ELSE 0 END) AS APPROVEDCOUNT,
SUM(CASE WHEN REQUISTATUS = 2 AND PROFILEHRID !=0 THEN 1 ELSE 0 END) AS DENIEDCOUNT,
SUM(CASE WHEN REQUISTATUS = 3 AND PROFILEHRID !=0 THEN 1 ELSE 0 END) AS DONECOUNT
FROM STR_REQUISITIONS`);


const getStockAlert = () => Execute(`
SELECT SP.PRONAME, SP.PRONAMETWO, C.CATEGORYBN, C.CATEGORYEN, SP.PROQTY, SP.STOCKALERT FROM STR_STOREPRODUCTS SP
LEFT OUTER JOIN STR_CATEGORIES C
ON SP.PROCATE = C.CAT_ID
WHERE SP.PROQTY <= SP.STOCKALERT AND SP.PROQTY != ${Number(0)} AND SP.PROTSTATUS = ${Number(1)}`);


/*--------------------------------END SELECT --------------------------------*/


module.exports = { getRequisitionStatusCount, getStockAlert }
