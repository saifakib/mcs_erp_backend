const { Execute } = require("../../../utils/dynamicController");


/*------------------------------------------------- SELECT ---------------------------------------------------*/
// Dynamic find individula item
module.exports.selectDynamicQuery = (tableName, columName, findValue) =>
  Execute(`SELECT * FROM ${tableName} WHERE ${columName} = '${findValue}'`);

// category
module.exports.getCategories = (search = "%%", page = 0, limit = 1000) => {
  let offset = limit * page;
  return Execute(
    `SELECT * FROM STR_CATEGORIES WHERE LOWER(CATEGORYEN) LIKE LOWER('${search}') ORDER BY CAT_ID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
  );
};

module.exports.getSingleCategory = ({ CAT_ID }) =>
  Execute(`SELECT * FROM STR_CATEGORIES WHERE CAT_ID = ${CAT_ID}`);

// unit
module.exports.getUnits = (search = "%%", page = 0, limit = 1000) => {
  let offset = limit * page;
  return Execute(
    `SELECT * FROM STR_UNITS WHERE LOWER(UNIT) LIKE LOWER('${search}') ORDER BY UNIT_ID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
  );
};

module.exports.getSingleUnit = ({ UNIT_ID }) =>
  Execute(`SELECT * FROM STR_UNITS WHERE UNIT_ID = ${UNIT_ID}`);

// supplier
module.exports.getSuppliers = (search = "%%", page = 0, limit = 1000) => {
  let offset = limit * page;
  return Execute(
    `SELECT * FROM STR_SUPPLIERS WHERE LOWER(SUPPLIER) LIKE LOWER('${search}') ORDER BY SUP_ID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
  );
};

module.exports.getSingleSupplier = ({ SUP_ID }) =>
  Execute(`SELECT * FROM STR_SUPPLIERS WHERE SUP_ID = ${SUP_ID}`);

// product
module.exports.getProducts = (search = "%%", page = 0, limit = 1000) => {
  let offset = limit * page;
  return Execute(
    `SELECT PL.PRODID, PL.PRONAME, PL.PRONAMETWO, PL.PROCATE, C.CATEGORYBN, C.CATEGORYEN FROM  STR_PRODUCTLISTS PL LEFT OUTER JOIN STR_CATEGORIES C ON C.CAT_ID = PL.PROCATE WHERE LOWER(PRONAME) LIKE LOWER('${search}') OR LOWER(C.CATEGORYEN) LIKE LOWER('${search}') ORDER BY PRODID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
  );
};

// get product count
module.exports.getCountProducts = () => {
  return Execute(
    `select count(prodid) as total_products from str_productlists`
  );
};

module.exports.getSingleProduct = ({ PRODID }) =>
  Execute(
    `SELECT PL.PRODID, PL.PRONAME, PL.PRONAMETWO, PL.PROCATE, C.CATEGORYBN, C.CATEGORYEN FROM  STR_PRODUCTLISTS PL LEFT OUTER JOIN STR_CATEGORIES C ON C.CAT_ID = PL.PROCATE WHERE PRODID = ${PRODID}`
  );

module.exports.getProductByCatId = ({
  CAT_ID,
  search = "%%",
  page = 0,
  limit = 1000,
}) => {
  let offset = limit * page;
  return Execute(
    `SELECT * FROM STR_PRODUCTLISTS WHERE PROCATE = ${parseInt(
      CAT_ID
    )} AND LOWER(PRONAME || PRONAMETWO) LIKE LOWER('${search}') ORDER BY PRODID OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
  );
};

// product category with length
module.exports.getCategoryWithLength = () =>
  Execute(
    "SELECT distinct(C.CAT_ID), C.CATEGORYBN, C.CATEGORYEN, COUNT(P.PRODID) OVER(PARTITION BY P.PROCATE) AS PRODUCTS FROM STR_CATEGORIES C LEFT OUTER JOIN STR_PRODUCTLISTS P ON C.CAT_ID = P.PROCATE ORDER BY CAT_ID DESC"
  );

/*------------------------------------------------- END SELECT ---------------------------------------------------*/







/*------------------------------------------------- INSERT ---------------------------------------------------*/

module.exports.postCategory = ({ categoryen, categorybn }) =>
  Execute(
    `INSERT INTO STR_CATEGORIES (CATEGORYBN, CATEGORYEN) VALUES ('${categorybn}', '${categoryen}')`
  );

module.exports.postUnits = ({ unit }) =>
  Execute(`INSERT INTO STR_UNITS (unit) VALUES ('${unit}')`);

module.exports.postSupplier = ({ supplier }) =>
  Execute(`INSERT INTO STR_SUPPLIERS (supplier) VALUES ('${supplier}')`);

module.exports.postProduct = ({ proname, pronametwo, procate }) =>
  Execute(
    `INSERT INTO STR_PRODUCTLISTS (proname, pronametwo, procate) VALUES ('${proname}', '${pronametwo}', '${procate}')`
  );

/*------------------------------------------------- END INSERT ---------------------------------------------------*/








/*------------------------------------------------- UPDATE ---------------------------------------------------*/

module.exports.updateCategory = ({ CATEGORYBN, CATEGORYEN, CAT_ID }) =>
  Execute(
    `UPDATE STR_CATEGORIES SET categorybn = '${CATEGORYBN}', categoryen = '${CATEGORYEN}' WHERE cat_id = ${CAT_ID}`
  );

module.exports.updateUnits = ({ UNIT, UNIT_ID }) =>
  Execute(`UPDATE STR_UNITS SET unit = '${UNIT}' WHERE unit_id = ${UNIT_ID}`);

module.exports.updateSupplier = ({ SUPPLIER, SUP_ID }) =>
  Execute(
    `UPDATE STR_SUPPLIERS SET supplier = '${SUPPLIER}' WHERE sup_id = ${SUP_ID}`
  );

module.exports.updateProducts = ({ PRONAME, PRONAMETWO, PROCATE, PRODID }) =>
  Execute(
    `UPDATE STR_PRODUCTLISTS SET proname = '${PRONAME}', pronametwo = '${PRONAMETWO}', procate = ${PROCATE} WHERE prodid = ${PRODID}`
  );

/*------------------------------------------------- END UPDATE ---------------------------------------------------*/






/*------------------------------------------------- DELETE ---------------------------------------------------*/
module.exports.deleteCategory = ({ CAT_ID }) =>
  Execute(`DELETE FROM STR_CATEGORIES WHERE CAT_ID = ${CAT_ID}`);

module.exports.deleteUnits = ({ UNIT_ID }) =>
  Execute(`DELETE FROM STR_UNITS WHERE UNIT_ID = ${UNIT_ID}`);

module.exports.deleteSupplier = ({ SUP_ID }) =>
  Execute(`DELETE FROM STR_SUPPLIERS WHERE SUP_ID = ${SUP_ID}`);

module.exports.deleteProducts = ({ PRODID }) =>
  Execute(`DELETE FROM STR_PRODUCTLISTS WHERE PRODID = ${PRODID}`);

/*------------------------------------------------- END DELETE ---------------------------------------------------*/