const { Execute } = require('../../../utils/dynamicController')

module.exports.getMonths = () => Execute("SELECT * FROM months");
module.exports.getCategories = () => Execute("SELECT * FROM STR_CATEGORIES");
module.exports.getUnits = () => Execute("SELECT * FROM STR_UNITS");
module.exports.getSuppliers = () => Execute("SELECT * from STR_SUPPLIERS");
module.exports.getProducts = () => Execute("SELECT * FROM STR_STOREPRODUCTS");


module.exports.postCategory = ({categorybn, categoryen}) => Execute( `INSERT INTO STR_CATEGORIES (categorybn, categoryen) VALUES ('${categorybn}', '${categoryen}')`)
