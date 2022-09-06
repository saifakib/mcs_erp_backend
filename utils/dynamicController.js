const { getConnection } = require("../db/db");

// execute single query
module.exports.Execute = (QuertyString, object = {}) => {
  return new Promise(async function (resolve, reject) {
    try {
      let connection = await getConnection();
      const result = await connection.execute(QuertyString, object);
      await connection.close();
      resolve(result);
    } catch (err) {
      console.log("error", err);
      reject(err);
    }
  });
};

// execute many query
module.exports.ExecuteMany = (QuertyString, data, options = {}) => {
  return new Promise(async function (resolve, reject) {
    try {
      let connection = await getConnection();
      const result = await connection.executeMany(QuertyString, data, options);
      await connection.close();
      resolve(result);
    } catch (err) {
      console.log("error on executeMany", err);
      reject(err);
    }
  });
};
