const { getData } = require("../../../utils/dynamicController");

module.exports.getMonths = getData("SELECT * FROM months");
module.exports.getCategories = getData("SELECT * FROM STR_CATEGORIES");
module.exports.getUnits = getData("SELECT * FROM STR_UNITS");
module.exports.getSuppliers = getData("SELECT * from STR_SUPPLIERS");
module.exports.getProducts = getData("SELECT * FROM STR_STOREPRODUCTS");
