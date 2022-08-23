const { Execute } = require("../../../utils/dynamicController");

/*------------- Get ------------*/
module.exports.getMonths = () => Execute("SELECT * FROM months");
module.exports.getCategories = () => Execute("SELECT * FROM STR_CATEGORIES");
module.exports.getUnits = () => Execute("SELECT * FROM STR_UNITS");
module.exports.getSuppliers = () => Execute("SELECT * from STR_SUPPLIERS");
module.exports.getProducts = () => Execute("SELECT * FROM STR_STOREPRODUCTS");

/*-------------- Post -------------------*/
module.exports.postCategory = ({ CATEGORYBN, CATEGORYEN }) =>
  Execute(
    `INSERT INTO STR_CATEGORIES (CATEGORYBN, CATEGORYEN) VALUES ('${CATEGORYBN}', '${CATEGORYEN}')`
  );

module.exports.postUnits = ({ UNIT }) =>
  Execute(`INSERT INTO STR_UNITS (UNIT) VALUES ('${UNIT}')`);

module.exports.postUnits = ({ UNIT }) =>
  Execute(`INSERT INTO STR_UNITS (UNIT) VALUES ('${UNIT}')`);

module.exports.postSupplier = ({ SUPPLIER, SUPSLUG }) =>
  Execute(
    `INSERT INTO STR_SUPPLIERS (UNIT) VALUES ('${SUPPLIER}', '${SUPSLUG}')`
  );

module.exports.postProduct = ({ PRONAME, PRONAMETWO, PROCATE }) =>
  Execute(
    `INSERT INTO STR_PRODUCTLISTS (UNIT) VALUES ('${PRONAME}', '${PRONAMETWO}', '${PROCATE}')`
  );

/* --------------- Update -------------------*/
module.exports.updateCategory = ({ CATEGORYBN, CATEGORYEN, CAT_ID }) =>
  Execute(
    `UPDATE STR_CATEGORIES SET CATEGORYBN = ${CATEGORYBN}, CATEGORYEN = ${CATEGORYEN} WHERE CAT_ID = ${CAT_ID}`
  );

module.exports.updateUnits = ({ UNIT, UNIT_ID }) =>
  Execute(`UPDATE STR_UNITS SET UNIT = ${UNIT} WHERE UNIT_ID = ${UNIT_ID}`);

module.exports.updateSupplier = ({ SUPPLIER, SUPSLUG, SUP_ID }) =>
  Execute(
    `UPDATE STR_SUPPLIERS SET SUPPLIER = ${SUPPLIER}, SUPSLUG = ${SUPSLUG} WHERE SUP_ID = ${SUP_ID}`
  );

module.exports.updateProducts = ({ PRONAME, PRONAMETWO, PROCATE, PRODID }) =>
  Execute(
    `UPDATE STR_PRODUCTLISTS SET PRONAME = ${PRONAME}, PRONAMETWO = ${PRONAMETWO}, PROCATE = ${PROCATE} WHERE PRODID = ${PRODID}`
  );

/*------------------ Delete ----------------*/
module.exports.deletCategory = ({ CAT_ID }) =>
  Execute(`DELETE FROM STR_CATEGORIES WHERE CAT_ID = ${CAT_ID}`);

module.exports.deleteUnits = ({ UNIT_ID }) =>
  Execute(`DELETE FROM STR_UNITS WHERE UNIT_ID = ${UNIT_ID}`);

module.exports.deleteSupplier = ({ SUP_ID }) =>
  Execute(`DELETE FROM STR_SUPPLIERS WHERE SUP_ID = ${SUP_ID}`);

module.exports.deleteProducts = ({ PRODID }) =>
  Execute(`DELETE FROM STR_PRODUCTLISTS WHERE PRODID = ${PRODID}`);
