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
module.exports.upDateCategory = ({ CATEGORYBN, CATEGORYEN, CAT_ID }) =>
  Execute(
    `UPDATE STR_CATEGORIES SET CATEGORYBN = ${CATEGORYBN}, CATEGORYEN = ${CATEGORYEN} WHERE CAT_ID = ${CAT_ID}`
  );
