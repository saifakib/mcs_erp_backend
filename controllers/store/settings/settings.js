const getConnection = require("../../../db/db");
const { createResponse } = require("../../../utils/responseGenerator");

/*------------- All Get Routes ---------------*/

// months
module.exports.getMonths = async (req, res, next) => {
  try {
    let connection = await getConnection();
    const result = await connection.execute("SELECT * FROM months");
    res.json(createResponse(result.rows));
    await connection.close();
  } catch (err) {
    next(err);
  }
};

// category
module.exports.getCategories = async (req, res, next) => {
  try {
    let connection = await getConnection();
    const result = await connection.execute("SELECT * from STR_CATEGORIES");
    res.json(createResponse(result.rows));
    await connection.close();
  } catch (err) {
    next(err);
  }
};

// units
module.exports.getUnits = async (req, res, next) => {
  try {
    let connection = await getConnection();
    const result = await connection.execute("SELECT * from STR_UNITS");
    res.json(createResponse(result.rows));
    await connection.close();
  } catch (err) {
    next(err);
  }
};

// suppliers
module.exports.getSuppliers = async (req, res, next) => {
  try {
    let connection = await getConnection();
    const result = await connection.execute("SELECT * from STR_SUPPLIERS");
    res.json(createResponse(result.rows));
    await connection.close();
  } catch (err) {
    next(err);
  }
};

// products
module.exports.getProducts = async (req, res, next) => {
  try {
    let connection = await getConnection();
    const result = await connection.execute("SELECT * from STR_STOREPRODUCTS");
    res.json(createResponse(result.rows));
    await connection.close();
  } catch (err) {
    next(err);
  }
};

/*------------- End ---------------*/

/*------------- All Post Routes ---------------*/

// category
module.exports.postCategory = async (req, res, next) => {
  try {
    const { categorybn, categoryen } = req.body;
    if (!categoryen) {
      res.json(createResponse(null, "Category name is required", true));
    } else {
      // statement
      const statement = `INSERT INTO STR_CATEGORIES (categorybn, categoryen) VALUES ('${categorybn}', '${categoryen}')`;
      let connection = await getConnection();
      const result = await connection.execute(statement);
      res.json(createResponse(result));
      await connection.close();
    }
  } catch (err) {
    next(err);
  }
};

// units
module.exports.postUnits = async (req, res, next) => {
  try {
    const { unit } = req.body;
    if (!unit) {
      res.json(createResponse(null, "Unit name is required", true));
    } else {
      // statement
      const statement = `INSERT INTO STR_UNITS VALUES ('${unit}')`;
      let connection = await getConnection();
      const result = await connection.execute(statement);
      res.json(createResponse(result));
      await connection.close();
    }
  } catch (err) {
    next(err);
  }
};

// supplier
module.exports.postSupplier = async (req, res, next) => {
  try {
    const { supplier, supsulg } = req.body;
    if (!supplier || !supsulg) {
      res.json(createResponse(null, "Field required", true));
    } else {
      // statement
      const statement = `INSERT INTO STR_SUPPLIERS ('${supplier}', '${supsulg}')`;
      let connection = await getConnection();
      const result = await connection.execute(statement);
      res.json(createResponse(result));
      await connection.close();
    }
  } catch (err) {
    next(err);
  }
};

// products
module.exports.postProduct = async (req, res, next) => {
  try {
    const { proname, pronametwo, procate } = req.body;
    if (!proname || !pronametwo || procate) {
      res.json(createResponse(null, "Field required", true));
    } else {
      // statement
      const statement = `INSERT INTO STR_PRODUCTLISTS ('${proname}', '${pronametwo}', '${procate}')`;
      let connection = await getConnection();
      const result = await connection.execute(statement);
      res.json(createResponse(result));
      await connection.close();
    }
  } catch (err) {
    next(err);
  }
};

/*------------- End ---------------*/

/*------------- All Update Routes ---------------*/

// category
module.exports.updateCategory = async (req, res, next) => {
  try {
    const { categoryen, categorybn } = req.body;
    const { cat_id } = req.headers;
    if (!categoryen) {
      res.json(createResponse(null, "Field required", true));
    } else if (!cat_id) {
      res.json(createResponse(null, "Category_id required", true));
    } else {
      // statement
      const statement = `UPDATE STR_CATEGORIES SET categorybn = ${categorybn}, categoryen = ${categoryen} WHERE cat_id = ${cat_id}`;
      let connection = await getConnection();
      const result = await connection.execute(statement);
      res.json(createResponse(result));
      await connection.close();
    }
  } catch (err) {
    next(err);
  }
};

/*------------- End ---------------*/
