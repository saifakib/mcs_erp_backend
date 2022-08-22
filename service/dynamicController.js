const getConnection = require("../db/db");
const { createResponse } = require("../utils/responseGenerator");

/**
 * GetData Dynamic Controler
 * @param {String} QuertyString 
 * @returns {JSON}
 */
const getData = (QuertyString) => {
    return async (_, res, next) => {
        try {
            let connection = await getConnection();
            const result = await connection.execute(QuertyString);
            await connection.close();
            // return res.json(createResponse(result.rows));
            return result.rows;
          } catch (err) {
            // next(err);
            return err;
          }
    }
};


module.exports = {
    getData
}
