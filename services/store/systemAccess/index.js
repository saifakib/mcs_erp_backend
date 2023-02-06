const { Execute } = require("../../../utils/dynamicController");

/*------------- Get ------------*/

const selectCategoryProductsWTStatus = (empid, catid) =>
    Execute(`SELECT SP.PROID, SP.PROCATE,  C.CATEGORYEN, SP.PRONAME, SP.PRONAMETWO, CASE
    WHEN (SELECT COUNT(*) FROM STR_ACCESS_PRODUCTS AC WHERE AC.PROID = SP.PROID AND AC.EMP_ID = ${Number(empid)}) = 1 THEN 1 ELSE 0
    END AS STATUS
    FROM STR_STOREPRODUCTS SP
    LEFT OUTER JOIN STR_CATEGORIES C ON SP.PROCATE = C.CAT_ID
    WHERE SP.PROCATE=${Number(catid)}`);


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
    selectCategoryProductsWTStatus, selectUserAccessProduct, insertProdAccessToUser, deleteProdAccessToUser
}
