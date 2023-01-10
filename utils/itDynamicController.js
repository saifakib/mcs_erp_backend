const { oracledb } = require("../db/db");
// oracledb.autoCommit = false;

// execute single query
const ExecuteIT = (QuertyString, object = {}) => {
  console.log(QuertyString)
  return new Promise(async function (resolve, reject) {
    try {
      let connection = await oracledb.getConnection("it");
      const result = await connection.execute(QuertyString, object);
      resolve(result);
      await connection.close();
    } catch (err) {
      //console.log("error", err);
      reject(err);
    }
  });
};
// execute many query
const ExecuteITMany = (QuertyString, binds, options = {}) => {
  // console.log(QuertyString)
  // console.log(binds)
  return new Promise(async function (resolve, reject) {
    try {
      let connection = await oracledb.getConnection("it");
      const result = await connection.executeMany(QuertyString, binds, options);
      resolve(result);
      await connection.close();
    } catch (err) {
      console.log("error on executeMany", err);
      reject(err);
    }
  });
};

module.exports = { ExecuteIT, ExecuteITMany };
