const { getData } = require('../../../service/dynamicController')

// module.exports.getMonths = () => {

//     return new Promise(async function (resolve, reject) {
//         try {
//             let connection = await getConnection();
//             const result = await connection.execute("SELECT * FROM months");
//             await connection.close();
//             resolve(result.rows)
//           } catch (err) {
//             reject(err.message)
//           }
//     })
// }

module.exports.getMonths = getData("SELECT * FROM months");
module.exports.getCategories = getData("SELECT * FROM STR_CATEGORIES");
module.exports.getUnits = getData("SELECT * FROM STR_UNITS");
module.exports.getSuppliers = getData("SELECT * from STR_SUPPLIERS");
module.exports.getProducts = getData("SELECT * FROM STR_STOREPRODUCTS");
