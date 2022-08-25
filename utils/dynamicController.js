const getConnection = require("../db/db");

module.exports.Execute = (QuertyString, object = {}) => {
  return new Promise(async function (resolve, reject) {
    try {
      let connection = await getConnection();
      const result = await connection.execute(QuertyString, object);
      await connection.close();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};
