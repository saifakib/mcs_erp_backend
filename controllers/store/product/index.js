const getConnection = require("../../../db/db");
const { createResponse } = require("../../../utils/responseGenerator");

/*------------- All Get Routes ---------------*/

// months
const checkProductDuplicate = async (req, res, next) => {
  const { id } = req.params;
  try {
    const statement = `SELECT * FROM str_productlists where prodid=${id}`;
    let connection = await getConnection();
    const result1 = await connection.execute(statement);
    if(result1.rows.length > 0) {
        const result2 = await connection.execute(`SELECT * FROM str_storeproducts where proname=${result1?.rows[0].proname}`);
        if(result2.rows.length > 0) {
            res.json(createResponse(true));
        } 
        else {
            res.json(createResponse(false));
        }
    } else {
        res.json(createResponse(null, 'Product Id does not exits'));
    }
    await connection.close();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkProductDuplicate,
};
