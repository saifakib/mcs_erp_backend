const { ExecuteIT } = require("../../../utils/itDynamicController");

/*-------------------------------- SELECT --------------------------------*/

const selectSupplierWithProductEntriesInfo = () => ExecuteIT(
    `SELECT DISTINCT(S.SUPPLIER_ID), S.SUP_NAME,  SUM(LT.QUANTITES*AMOUNT) OVER(PARTITION BY LT.SUP_ID) AS Total_Amount, SUM(LT.QUANTITES) OVER (PARTITION BY  LT.SUP_ID) AS Total_quantity FROM PRODUCT_ENTRY_LIST LT LEFT OUTER JOIN SUPPLIERS S ON LT.SUP_ID = S.SUPPLIER_ID ORDER BY SUPPLIER_ID`
);

const selectMrrProListBySupplierId = (supplier_id) => ExecuteIT(
    `SELECT DISTINCT (PEL.ENTRY_DATE), PEL.SUP_ID, PEL.MRR_ID, M.MRR_NO 
    FROM PRODUCT_ENTRY_LIST PEL 
    LEFT OUTER JOIN MRRLOGS M
    ON M.MRR_LOG_ID = PEL.MRR_ID
    WHERE PEL.SUP_ID = ${Number(supplier_id)}`
);

const selectmrrByMrrno = (mrr_no, supplier_id) => ExecuteIT(
    `SELECT * FROM MRRLOGS WHERE SUP_ID = ${supplier_id} AND MRR_NO= ${mrr_no} FETCH NEXT 1 ROWS ONLY`
);

const selectProductEntriLists = (supplier_id, mrr_log_id) =>
    ExecuteIT(
        `SELECT PL.PRODUCT_NAME, S.STR_PRO_ID, LT.QUANTITES, S.PRICE, U.UNIT_NAME, M.MODEL_NAME, B.BRAND_NAME FROM PRODUCT_ENTRY_LIST LT 
        LEFT OUTER JOIN STORE_PRODUCTS S ON LT.STR_PRO_ID = S.STR_PRO_ID 
        LEFT OUTER JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = LT.PRO_ID 
        LEFT OUTER JOIN MODELS M ON M.MODEL_ID = S.MODEL_ID 
        LEFT OUTER JOIN BRAND B ON B.BRAND_ID = S.BRAND_ID 
        LEFT OUTER JOIN UNIT U ON S.UNIT_ID = U.UNIT_ID 
        WHERE SUP_ID = ${supplier_id} AND MRR_ID=${mrr_log_id}`
    );

/*-------------------------------- END SELECT --------------------------------*/



module.exports = { selectSupplierWithProductEntriesInfo, selectMrrProListBySupplierId, selectmrrByMrrno, selectProductEntriLists }