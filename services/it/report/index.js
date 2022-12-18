const { ExecuteIT } = require("../../../utils/itDynamicController");

/*-------------------------------- SELECT --------------------------------*/

/*--------------------- Entries Report ----------------- */
const selectAllEntriesReports = (fdate, tdate) =>
  ExecuteIT(
    `SELECT pel.PRO_EN_L_ID, pel.pro_id, TO_CHAR(pel.ENTRY_DATE,'DD-MON-YYYY') AS Dates,  b.brand_name,m.model_name,
      s.SUP_NAME,  c.CATEGORY_NAME, pl.PRODUCT_NAME, pel.QUANTITES, pel.amount, pel.QUANTITES*pel.amount as Total_amount
      FROM PRODUCT_ENTRY_LIST PEL LEFT OUTER JOIN STORE_PRODUCTS sp on sp.str_pro_id = pel.str_pro_id
      left outer join PRODUCT_LIST pl on pl.product_id = sp.pro_id
      left outer join  CATEGORIES c on c.category_id = pl.category_id
      left outer join SUPPLIERS s on s.SUPPLIER_ID = pel.sup_id
      left outer join brand b on b.brand_id = sp.brand_id
      left outer join models m on m.model_id = sp.model_id
      WHERE pel.ENTRY_DATE >= TO_DATE('${fdate}','YYYY-MM-DD') + 6   and
      pel.ENTRY_DATE <= TO_DATE('${tdate}','YYYY-MM-DD') + 6 order by pel.PRO_EN_L_ID`
  );

const selectsingleEntriesReports = (productidno, fdate, tdate) =>
  ExecuteIT(
    `SELECT pel.PRO_EN_L_ID, pel.pro_id, TO_CHAR(pel.ENTRY_DATE,'DD-MON-YYYY') AS Dates,  b.brand_name,m.model_name,
    s.SUP_NAME,  c.CATEGORY_NAME, pl.PRODUCT_NAME, pel.QUANTITES, pel.amount, pel.QUANTITES*pel.amount as Total_amount
    FROM PRODUCT_ENTRY_LIST PEL LEFT OUTER JOIN STORE_PRODUCTS sp on sp.str_pro_id = pel.str_pro_id
    left outer join PRODUCT_LIST pl on pl.product_id = sp.pro_id
    left outer join  CATEGORIES c on c.category_id = pl.category_id
    left outer join SUPPLIERS s on s.SUPPLIER_ID = pel.sup_id
    left outer join brand b on b.brand_id = sp.brand_id
      left outer join models m on m.model_id = sp.model_id
    WHERE pel.ENTRY_DATE >= TO_DATE('${fdate}','YYYY-MM-DD') + 6 and
    pel.ENTRY_DATE <= TO_DATE('${tdate}','YYYY-MM-DD') + 6 and pl.PRODUCT_ID = ${Number(productidno)} order by  pel.PRO_EN_L_ID`
  );
/*--------------------- End Entries Report ----------------- */


/*--------------------------------END SELECT --------------------------------*/

module.exports = {
  selectAllEntriesReports,
  selectsingleEntriesReports,
};
