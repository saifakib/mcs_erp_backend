const getConnection = require("../../../db/db");
const { createResponse } = require("../../../utils/responseGenerator");

/*------------- All Get Routes ---------------*/

const manageProducts = async (req, res, next) => {

  try {
    let connection = await getConnection();
    const categorirs = await connection.execute("SELECT * FROM STR_CATEGORIES ORDER BY categoryen ASC");
    const totalproducts = await connection.execute("SELECT SUM(quantities) FROM STR_PRODUCTENTRILISTS");
    const totalquantites = await connection.execute("SELECT COUNT(proid) FROM STR_STOREPRODUCTS");
    const products = await connection.execute("SELECT * FROM STR_STOREPRODUCTS ORDER BY proid ASC");

    let result = {
        categorirs: categorirs.rows,
        totalproducts: totalproducts.rows,
        totalquantites: totalquantites.rows,
        products: products.rows
    }

    res.json(createResponse(result));

    await connection.close();
  } catch (err) {
    next(err);
  }
};

const checkProductDuplicate = async (req, res, next) => {
  const { id } = req.params;
  try {
    const statement = `SELECT * FROM str_productlists where prodid=${id}`;
    let connection = await getConnection();
    const result1 = await connection.execute(statement);
    if (result1.rows.length > 0) {
      const result2 = await connection.execute(
        `SELECT * FROM str_storeproducts where proname=${result1?.rows[0].proname}`
      );
      if (result2.rows.length > 0) {
        res.json(createResponse(true));
      } else {
        res.json(createResponse(false));
      }
    } else {
      res.json(createResponse(null, "Product Id does not exits"));
    }
    await connection.close();
  } catch (err) {
    next(err);
  }
};

const getCategoryProductlist = async (req, res, next) => {
  const { id } = req.params;
  try {
    let connection = await getConnection();
    const result = await connection.execute(
      `SELECT * FROM str_productlists where prodid=${id}`
    );
    if (result.rows.length > 0) {
      res.json(createResponse(result.rows));
    } else {
      res.json(createResponse(null, "Product Id does not exits"));
    }
    await connection.close();
  } catch (err) {
    next(err);
  }
};

const categoryProducts = async (req, res, next) => {
    const { id } = req.params;
    try {
      let connection = await getConnection();
      const category = await connection.execute(`SELECT * FROM STR_CATEGORIES WHERE cat_id=${id}`);
      const totalproducts = await connection.execute(`SELECT SUM(proqty) FROM STR_PRODUCTENTRILISTS WHERE procate=${id}`);
      // const getproducts = await connection.execute("");
  
      let result = {
          category: category.rows,
          totalproducts: totalproducts.rows
      }
  
      res.json(createResponse(result));
  
      await connection.close();
    } catch (err) {
      next(err);
    }
  };


module.exports = {
  manageProducts,
  checkProductDuplicate,
  getCategoryProductlist,
  categoryProducts
};
