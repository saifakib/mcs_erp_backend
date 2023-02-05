const { Execute } = require("../../../utils/dynamicController");

/*------------- Get ------------*/

const selectCategoryProductsWTStatus = (cat_id) => Execute(`SELECT * FROM STR_STOREPRODUCTS SP LEFT OUTER JOIN STR_UNITS U ON SP.PRODUNIT = U.UNIT_ID where procate=${cat_id}`)

TODO:
// SELECT DISTINCT(SP.PROID), SP.PROCATE, SP.PRONAME, SP.PRONAMETWO, AC.PROID, CASE
//  WHEN AC.EMP_ID=261 AND (AC.PROID IS NULL THEN 'No Access' ELSE 'Access') END STATUS
// FROM STR_STOREPRODUCTS SP
// LEFT OUTER JOIN STR_ACCESS_PRODUCTS AC ON SP.PROID = AC.PROID
// WHERE SP.PROCATE=4;



const selectUserAccessProduct = (empid) => Execute(
    `SELECT SP.PRONAME, SP.PRONAMETWO, C.CATEGORYEN, C.CATEGORYBN FROM STR_ACCESS_PRODUCTS AP
    LEFT OUTER JOIN STR_STOREPRODUCTS SP ON AP.PROID = SP.PROID
    LEFT OUTER JOIN STR_CATEGORIES C ON C.CAT_ID = SP.PROCATE
    WHERE EMP_ID = ${Number(empid)}`
);

/*------------------ Post -------------------*/
const insertProdAccessToUser = ({ empid, proid }) =>
    Execute(
        `INSERT INTO STR_ACCESS_PRODUCTS (EMP_ID, PROID) VALUES (${Number(empid)}, ${Number(proid)})`
    );



/*------------------ Delete ----------------*/
const deleteProdAccessToUser = ({ empid, proid }) =>
    Execute(`DELETE FROM STR_ACCESS_PRODUCTS WHERE EMP_ID = ${Number(empid)} AND PROID = ${Number(proid)}`);


module.exports = {
    selectUserAccessProduct, insertProdAccessToUser, deleteProdAccessToUser
}
