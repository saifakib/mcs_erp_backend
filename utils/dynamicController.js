const { getConnection } = require("../db/db");

// execute single query
module.exports.Execute = (QuertyString, object = {}) => {
  return new Promise(async function (resolve, reject) {
    try {
      const connection = await getConnection("store");
      const result = await connection.execute(QuertyString, object);
      resolve(result);
      await connection.close();
    } catch (err) {
      console.log("error", err);
      reject(err);
    }
  });
};
// // execute many query
module.exports.ExecuteMany = (QuertyString, binds, options = {}) => {
  return new Promise(async function (resolve, reject) {
    try {
      let connection = await getConnection("store");
      const result = await connection.executeMany(QuertyString, binds, options);
      resolve(result);
      await connection.close();
    } catch (err) {
      console.log("error on executeMany", err);
      reject(err);
    }
  });
};