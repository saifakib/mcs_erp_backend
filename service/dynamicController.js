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
            res.json(createResponse(result));
            await connection.close();
          } catch (err) {
            next(err);
          }
    }
};


module.exports = {
    getData
}
