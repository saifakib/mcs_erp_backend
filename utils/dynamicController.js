const getConnection = require("../db/db");

module.exports.Execute = (QuertyString = null) => {
  return new Promise(async function (resolve, reject) {
    try {
      let connection = await getConnection();
      const result = await connection.execute(QuertyString);
      await connection.close();
      console.log(result.rows.toLowerCase());
      resolve(result.rows);
    } catch (err) {
      reject(err);
    }
  });
};
