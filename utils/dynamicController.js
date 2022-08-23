const getConnection = require("../db/db");
const { createResponse } = require("../utils/responseGenerator");

module.exports.Execute = (QuertyString = null) => {
  return new Promise (async function (resolve, reject) {
    try {
      let connection = await getConnection();
      const result = await connection.execute(QuertyString);
      await connection.close();
      resolve(result.rows)
    } catch (err) {
      reject(err)
    }
  })
};

