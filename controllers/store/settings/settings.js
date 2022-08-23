const getConnection = require("../../../db/db");
const { createResponse } = require("../../../utils/responseGenerator");
const {
  getMonths,
  getCategories,
  getUnits,
  getSuppliers,
  getProducts,
  postCategory,
  postUnits,
  postSupplier,
  postProduct,
  upDateCategory,
} = require("../../../services/store/settings/index");

/*------------- All Get Routes ---------------*/

// months
module.exports.getMonths = async (req, res, next) => {
  try {
    const data = await getMonths();
    console.log(data);
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
    const { CATEGORYEN } = req.body;
    if (!CATEGORYEN) {
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
    const { UNIT } = req.body;
    if (!UNIT) {
      res.json(createResponse(null, "Unit name is required", true));
    } else {
      const result = await postUnits(req.body);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

// supplier
module.exports.postSupplier = async (req, res, next) => {
  try {
    const { SUPPLIER, SUPSLUG } = req.body;
    if (!SUPPLIER || !SUPSLUG) {
      res.json(createResponse(null, "Both field required", true));
    } else {
      const result = await postSupplier(req.body);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

// products
module.exports.postProduct = async (req, res, next) => {
  try {
    const { PRONAME, PRONAMETWO, PROCATE } = req.body;
    if (!PRONAME || !PRONAMETWO || PROCATE) {
      res.json(createResponse(null, "Field required", true));
    } else {
      const result = await postProduct(req.body);
      res.json(createResponse(result));
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
    const { CATEGORYEN, CATEGORYBN } = req.body;
    const { CAT_ID } = req.headers;
    if (!CATEGORYEN || !CAT_ID) {
      res.json(createResponse(null, "Field required", true));
    } else {
      const data = { CATEGORYEN, CATEGORYBN, CAT_ID };
      const result = await upDateCategory(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

/*------------- End ---------------*/
