const { createResponse } = require("../../../utils/responseGenerator");
const {
  getMonths,
  getCategories,
  getSingleCategory,
  getUnits,
  getSingleUnit,
  getSuppliers,
  getSingleSupplier,
  getProducts,
  getSingleProduct,
  postCategory,
  postUnits,
  postSupplier,
  postProduct,
  updateCategory,
  updateSupplier,
  updateUnits,
  updateProducts,
  deleteCategory,
  deleteSupplier,
  deleteUnits,
  deleteProducts,
} = require("../../../services/store/settings");

/*------------- All Get Routes ---------------*/

// months
module.exports.getMonths = async (req, res, next) => {
  try {
    const data = await getMonths();
    res.json(createResponse(data.rows));
  } catch (err) {
    next(err.message);
  }
};

// category
module.exports.getCategories = async (req, res, next) => {
  try {
    const result = await getCategories();
    res.json(createResponse(result.rows));
  } catch (err) {
    next(err.message);
  }
};
// single category
module.exports.getSingleCategory = async (req, res, next) => {
  try {
    const { cat_id } = req.headers;
    if (!cat_id) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const result = await getSingleCategory({ CAT_ID: cat_id });
      res.json(createResponse(result.rows[0]));
    }
  } catch (err) {
    next(err.message);
  }
};

// units
module.exports.getUnits = async (req, res, next) => {
  try {
    const result = await getUnits();
    res.json(createResponse(result.rows));
  } catch (err) {
    next(err.message);
  }
};

// single unit
module.exports.getSingleUnit = async (req, res, next) => {
  try {
    const { unit_id } = req.headers;
    if (!unit_id) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const result = await getSingleUnit({ UNIT_ID: unit_id });
      res.json(createResponse(result.rows[0]));
    }
  } catch (err) {
    next(err.message);
  }
};

// suppliers
module.exports.getSuppliers = async (req, res, next) => {
  try {
    const result = await getSuppliers();
    res.json(createResponse(result.rows));
  } catch (err) {
    next(err.message);
  }
};

// single supplier
module.exports.getSingleSupplier = async (req, res, next) => {
  try {
    const { sup_id } = req.headers;
    if (!sup_id) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const result = await getSingleSupplier({ SUP_ID: sup_id });
      res.json(createResponse(result.rows[0]));
    }
  } catch (err) {
    next(err.message);
  }
};

// products
module.exports.getProducts = async (req, res, next) => {
  try {
    const result = await getProducts();
    res.json(createResponse(result.rows));
  } catch (err) {
    next(err.message);
  }
};

// single product
module.exports.getSingleProduct = async (req, res, next) => {
  try {
    const { prodid } = req.headers;
    if (!prodid) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const result = await getSingleProduct({ PRODID: prodid });
      res.json(createResponse(result.rows[0]));
    }
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
      console.log(result);
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
      const result = await updateCategory(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateUnits = async (req, res, next) => {
  try {
    const { UNIT } = req.body;
    const { UNIT_ID } = req.headers;
    if (!UNIT || !UNIT_ID) {
      res.json(createResponse(null, "Field required", true));
    } else {
      const data = { UNIT, UNIT_ID };
      const result = await updateUnits(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateSupplier = async (req, res, next) => {
  try {
    const { SUPPLIER, SUPSLUG } = req.body;
    const { SUP_ID } = req.headers;
    if (!SUPPLIER || !SUPSLUG || SUP_ID) {
      res.json(createResponse(null, "Field required", true));
    } else {
      const data = { SUPPLIER, SUPSLUG, SUP_ID };
      const result = await updateSupplier(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateProducts = async (req, res, next) => {
  try {
    const { PRONAME, PRONAMETWO, PROCATE } = req.body;
    const { PRODID } = req.headers;
    if (!PRONAME || !PRONAMETWO || PROCATE || PRODID) {
      res.json(createResponse(null, "Field required", true));
    } else {
      const data = { PRONAME, PRONAMETWO, PROCATE, PRODID };
      const result = await updateProducts(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

/*------------- End ---------------*/

/*------------- All Delete Routes ---------------*/
module.exports.deleteCategory = async (req, res, next) => {
  try {
    const { cat_id } = req.headers;
    if (!cat_id) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const data = { CAT_ID: cat_id };
      const result = await deleteCategory(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

module.exports.deleteUnits = async (req, res, next) => {
  try {
    const { unit_id } = req.headers;
    if (!unit_id) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const data = { UNIT_ID: unit_id };
      const result = await deleteUnits(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

module.exports.deleteSupplier = async (req, res, next) => {
  try {
    const { sup_id } = req.headers;
    if (!sup_id) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const data = { SUP_ID: sup_id };
      const result = await deleteSupplier(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

module.exports.deleteProducts = async (req, res, next) => {
  try {
    const { prodid } = req.headers;
    if (!prodid) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const data = { PRODID: prodid };
      const result = await deleteProducts(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};
