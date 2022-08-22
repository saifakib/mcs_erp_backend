const getConnection = require("../db/db");
const { createResponse } = require("../utils/responseGenerator");

//
module.exports.getData = (QuertyString) => {
  return async () => {
    try {
      let connection = await getConnection();
      const result = await connection.execute(QuertyString);
      await connection.close();
      return result.rows;
    } catch (err) {
      return err;
    }
  };
};
