const { ExecuteIT } = require("../../../utils/itDynamicController");

/*-------------------------------- SELECT --------------------------------*/

/*--------------------- Entries Report ----------------- */
const selectAllEntriesReports = (fdate, tdate) =>
    ExecuteIT(
        `SELECT
        pel.PRO_EN_L_ID,
        TO_CHAR(pel.ENTRY_DATE,'DD-MON-YYYY') AS Dates,
        s.SUP_NAME,c.CATEGORY_NAME,pl.PRODUCT_NAME,pel.QUANTITES,pel.amount,pel.QUANTITES*pel.amount as Total_amount
      FROM PRODUCT_ENTRY_LIST PEL 
      LEFT OUTER JOIN SUPPLIERS s on s.SUPPLIER_ID = pel.sup_id
         left outer join  STORE_PRODUCTS sp on sp.str_pro_id = pel.str_pro_id
         left outer join PRODUCT_LIST pl on pl.product_id = sp.pro_id
         left outer join  CATEGORIES c on c.category_id = pl.category_id
       where pel.ENTRY_DATE BETWEEN TO_DATE('${fdate}','YYYY-MM-DD') AND TO_DATE('${tdate}','YYYY-MM-DD')`
    );

const selectsingleEntriesReports = (productidno, fdate, tdate) =>
    ExecuteIT(
        `SELECT ST.PRONAME, ST.PRONAMETWO, LT.PROLISTID, LT.PRODATE, LT.MRRNUMBER, S.SUPPLIER, CT.CATEGORYEN, LT.QUANTITIES, LT.PROAMOUNT, LT.PROAMOUNT * LT.QUANTITIES as TOTALAMOUNT, U.UNIT FROM STR_PRODUCTENTRILISTS LT  LEFT OUTER JOIN STR_SUPPLIERS S ON LT.PRODUCTFROM = S.SUP_ID LEFT OUTER JOIN STR_STOREPRODUCTS ST ON ST.PROID = LT.PRODUCTIDNO LEFT OUTER JOIN STR_CATEGORIES CT ON CT.CAT_ID = ST.PROCATE LEFT OUTER JOIN STR_UNITS U ON ST.PRODUNIT = U.UNIT_ID WHERE LT.PRODATE >= '${fdate}' AND LT.PRODATE <= '${tdate}' AND PRODUCTIDNO = ${Number(
            productidno
        )}`
    );
/*--------------------- End Entries Report ----------------- */


/*--------------------------------END SELECT --------------------------------*/

module.exports = {
    selectAllEntriesReports,
    selectsingleEntriesReports,
};
