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
)




module.exports = {
    selectSupplierWithProductEntriesInfo,
    selectMrrProListBySupplierId
}