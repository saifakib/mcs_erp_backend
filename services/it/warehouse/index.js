const { ExecuteIT } = require("../../../utils/itDynamicController");

/*-------------------------------- SELECT --------------------------------*/

const selectRequisitionCountWithApprovd = () => ExecuteIT(`SELECT COUNT(REQ_ID) AS TOTALREQUISITIONS, SUM(CASE WHEN REQ_STATUS = 1 OR REQ_STATUS = 2 THEN 1 ELSE 0 END) AS APPROVEDREQUISITIONS FROM REQUISITION`);

const selectRequisitionStatusCount = () => ExecuteIT(`SELECT  
    SUM(CASE WHEN REQ_STATUS = 0 THEN 1 ELSE 0 END) AS PENDINGCOUNT, 
    SUM(CASE WHEN REQ_STATUS = 1 THEN 1 ELSE 0 END) AS APPROVEDCOUNT,
    SUM(CASE WHEN REQ_STATUS = 2 THEN 1 ELSE 0 END) AS DONECOUNT,
    SUM(CASE WHEN REQ_STATUS = 3  THEN 1 ELSE 0 END) AS DENIEDCOUNT
    FROM REQUISITION`);


const selectCountStockAlert = () => ExecuteIT(`
SELECT SP.PRO_ID, PL.PRODUCT_NAME, C.CATEGORY_NAME, M.MODEL_NAME, B.BRAND_NAME, SP.QUANTITY, SP.NON_WORKABLE, SP.STOCK_ALERT
FROM STORE_PRODUCTS SP 
    LEFT OUTER JOIN PRODUCT_LIST PL ON SP.PRO_ID = PL.PRODUCT_ID
    LEFT OUTER JOIN CATEGORIES C ON C.CATEGORY_ID = PL.CATEGORY_ID
    LEFT OUTER JOIN MODELS M ON SP.MODEL_ID = M.MODEL_ID
    LEFT OUTER JOIN BRAND B ON SP.BRAND_ID = B.BRAND_ID
    WHERE (SP.QUANTITY - SP.NON_WORKABLE) <= SP.STOCK_ALERT AND SP.QUANTITY != ${Number(0)}`);


/*--------------------------------END SELECT --------------------------------*/


module.exports = { selectRequisitionCountWithApprovd, selectRequisitionStatusCount, selectCountStockAlert }
