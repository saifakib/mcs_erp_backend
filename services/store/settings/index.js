const { Execute } = require("../../../utils/dynamicController");

/*------------- Get ------------*/
module.exports.getMonths = (search) =>
  Execute(
    `SELECT * FROM months WHERE LOWER(MONTHS) LIKE '${search}' ORDER BY ID`
  );
// category
module.exports.getCategories = (search) =>
  Execute(
    `SELECT * FROM STR_CATEGORIES WHERE LOWER(CATEGORYEN) LIKE LOWER('${search}') ORDER BY CAT_ID ASC`
  );
module.exports.getSingleCategory = ({ CAT_ID }) =>
  Execute(`SELECT * FROM STR_CATEGORIES WHERE CAT_ID = ${CAT_ID}`);

// unit
module.exports.getUnits = (search) =>
  Execute(
    `SELECT * FROM STR_UNITS WHERE LOWER(UNIT) LIKE LOWER('${search}') ORDER BY UNIT_ID`
  );
module.exports.getSingleUnit = ({ UNIT_ID }) =>
  Execute(`SELECT * FROM STR_UNITS WHERE UNIT_ID = ${UNIT_ID}`);

// supplier
module.exports.getSuppliers = (search) =>
  Execute(
    `SELECT * FROM STR_SUPPLIERS WHERE LOWER(SUPPLIER) LIKE LOWER('${search}') ORDER BY SUP_ID`
  );
module.exports.getSingleSupplier = ({ SUP_ID }) =>
  Execute(`SELECT * FROM STR_SUPPLIERS WHERE SUP_ID = ${SUP_ID}`);

// product
module.exports.getProducts = (search) =>
  Execute(
    `SELECT * FROM STR_STOREPRODUCTS WHERE LOWER(PRONAME) LIKE LOWER('${search}')`
  );
module.exports.getSingleProduct = ({ PRODID }) =>
  Execute(`SELECT * FROM STR_STOREPRODUCTS WHERE PRODID = ${PRODID}`);

/*-------------- Post -------------------*/
module.exports.postCategory = ({ categoryen, categorybn }) =>
  Execute(
    `INSERT INTO STR_CATEGORIES (CATEGORYBN, CATEGORYEN) VALUES ('${categorybn}', '${categoryen}')`
  );

module.exports.postUnits = ({ unit }) =>
  Execute(`INSERT INTO STR_UNITS (UNIT) VALUES ('${unit}')`);

module.exports.postSupplier = ({ supplier }) =>
  Execute(`INSERT INTO STR_SUPPLIERS (supplier) VALUES ('${supplier}')`);

module.exports.postProduct = ({ proname, pronametwo, procate }) =>
  Execute(
    `INSERT INTO STR_PRODUCTLISTS (proname, pronametwo, procate) VALUES ('${proname}', '${pronametwo}', '${procate}')`
  );

/*------------------ End ----------------*/

/* --------------- Update -------------------*/
module.exports.updateCategory = ({ CATEGORYBN, CATEGORYEN, CAT_ID }) =>
  Execute(
    `UPDATE STR_CATEGORIES SET categorybn = :data1, categoryen = :data2 WHERE cat_id :id`,
    { id: CAT_ID, data1: CATEGORYBN, data2: CATEGORYEN }
  );

module.exports.updateUnits = ({ UNIT, UNIT_ID }) =>
  Execute(`UPDATE STR_UNITS SET unit = ${UNIT} WHERE unit_id = ${UNIT_ID}`);

module.exports.updateSupplier = ({ SUPPLIER, SUP_ID }) =>
  Execute(
    `UPDATE STR_SUPPLIERS SET supplier = ${SUPPLIER} WHERE sup_id = ${SUP_ID}`
  );

module.exports.updateProducts = ({ PRONAME, PRONAMETWO, PROCATE, PRODID }) =>
  Execute(
    `UPDATE STR_PRODUCTLISTS SET proname = ${PRONAME}, pronametwo = ${PRONAMETWO}, procate = ${PROCATE} WHERE prodid = ${PRODID}`
  );

/*------------------ End ----------------*/

/*------------------ Delete ----------------*/
module.exports.deleteCategory = ({ CAT_ID }) =>
  Execute(`DELETE FROM STR_CATEGORIES WHERE CAT_ID = ${CAT_ID}`);

module.exports.deleteUnits = ({ UNIT_ID }) =>
  Execute(`DELETE FROM STR_UNITS WHERE UNIT_ID = ${UNIT_ID}`);

module.exports.deleteSupplier = ({ SUP_ID }) =>
  Execute(`DELETE FROM STR_SUPPLIERS WHERE SUP_ID = ${SUP_ID}`);

module.exports.deleteProducts = ({ PRODID }) =>
  Execute(`DELETE FROM STR_PRODUCTLISTS WHERE PRODID = ${PRODID}`);

/*------------------ End ----------------*/
