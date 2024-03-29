
const { oracledb } = require("../db/db");

// execute single query
module.exports.Execute = (QuertyString, object = {}) => {
  return new Promise(async function (resolve, reject) {
    try {
      let connection = await oracledb.getConnection("store");
      const result = await connection.execute(QuertyString, object);
      resolve(result);
      await connection.close();
    } catch (err) {
      console.log("error", err);
      reject(err);
    }
  });
};

module.exports.Executee = (QuertyString, object = {}, type = 2) => {
  return new Promise(async function (resolve, reject) {
    try {
      let connection = await oracledb.getConnection("store");
      const result = await connection.execute(QuertyString, object);
      if (type === 1) {
        if (result) {
          resolve(result);
        } else {
          resolve(result);
        }
      }
      else {
        resolve(result);
      }
      await connection.close();
    } catch (err) {
      if (type === 1) {
        resolve(err);
      }
      else {
        reject(err);
      }
    }
  });
};

// execute many query
module.exports.ExecuteMany = (QuertyString, binds, options = {}) => {
  return new Promise(async function (resolve, reject) {
    try {
      let connection = await oracledb.getConnection("store");
      const result = await connection.executeMany(QuertyString, binds, options);
      resolve(result);
      await connection.close();
    } catch (err) {
      reject(err);
    }
  });
};
