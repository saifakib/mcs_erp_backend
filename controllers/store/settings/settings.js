const getConnection = require("../../../db/db");
const { createResponse } = require("../../../utils/responseGenerator");
const {
  getMonths,
  getCategories,
  getUnits,
  getSuppliers,
  getProducts,
  postCategory
} = require("../../../services/store/settings/index");
const { Execute } = require('../../../utils/dynamicController')

/*------------- All Get Routes ---------------*/

// months
module.exports.getMonths = async (req, res, next) => {
  try {
    const data = await getMonths();
    console.log(data)
    res.json(createResponse(data));
  } catch (err) {
    next(err.message);
  }
};

// category
module.exports.getCategories = async (req, res, next) => {
  try {
    const result = await getCategories();
    res.json(createResponse(result));
  } catch (err) {
    next(err.message);
  }
};

// units
module.exports.getUnits = async (req, res, next) => {
  try {
    const result = await getUnits();
    res.json(createResponse(result));
  } catch (err) {
    next(err.message);
  }
};

// suppliers
module.exports.getSuppliers = async (req, res, next) => {
  try {
    const result = await getSuppliers();
    res.json(createResponse(result));
  } catch (err) {
    next(err.message);
  }
};

// products
module.exports.getProducts = async (req, res, next) => {
  try {
    const result = await getProducts();
    res.json(createResponse(result));
  } catch (err) {
    next(err.message);
  }
};

/*------------- End ---------------*/

/*------------- All Post Routes ---------------*/

// category
module.exports.postCategory = async (req, res, next) => {
  try {
    const { categoryen, categorybn } = req.body;
    if (!categoryen) {
      res.json(createResponse(null, "Category name is required", true));
    } else {
      const result = await postCategory(req.body);
      res.json(createResponse(result));
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
      const statement = `INSERT INTO STR_UNITS (unit) VALUES ('${unit}')`;
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
      const statement = `INSERT INTO STR_SUPPLIERS (supplier,supsulg) VALUES ('${supplier}', '${supsulg}')`;
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