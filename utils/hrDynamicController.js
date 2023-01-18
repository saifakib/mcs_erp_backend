const { getConnection } = require("../db/db");

// execute single query
module.exports.ExecuteHR = (QuertyString, object = {}, type) => {
  return new Promise(async function (resolve, reject) {
    try {
      const connection = await getConnection("hr");
      const result = await connection.execute(QuertyString, object);
      if (type === 1) {
        resolve({ data: result, error: null });
      }
      else {
        resolve(result);
      }
      await connection.close();
    } catch (err) {
      console.log("hitting", err);
      if (type === 1) {
        resolve({ data: null, error: err });
      }
      else {
        reject(err);
      }
      // resolve({ data: null, error: err });    
    }
  });
};

// // execute many query
module.exports.ExecuteHRMany = (QuertyString, binds, options = {}) => {
  return new Promise(async function (resolve, reject) {
    try {
      let connection = await getConnection("hr");
      const result = await connection.executeMany(QuertyString, binds, options);
      resolve(result);
      await connection.close();
    } catch (err) {
      console.log("error on executeMany", err);
      reject(err);
    }
  });
};
