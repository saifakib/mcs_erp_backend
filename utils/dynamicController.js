const { getConnection } = require("../db/db");

module.exports.Execute = (QuertyString, object={}) => {
  console.log(QuertyString)
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
