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
  getCountProducts,
  getSingleProduct,
  getCategoryWithLength,
  getProductByCatId,
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
    const { search } = req.headers;
    if (!search) {
      res.json(createResponse(null, "Parameter required", true));
    } else {
      const data = await getMonths(search);
      res.json(createResponse(data.rows));
    }
  } catch (err) {
    next(err.message);
  }
};

// category
module.exports.getCategories = async (req, res, next) => {
  try {
    const { search } = req.headers;
    const { page, limit } = req.query;
    if (!search) {
      res.json(createResponse(null, "Parameter required", true));
    } else {
      const result = await getCategories(search, page, limit);
      res.json(createResponse(result.rows));
    }
  } catch (err) {
    next(err.message);
  }
};
// single category
module.exports.getSingleCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const result = await getSingleCategory({ CAT_ID: id });
      res.json(createResponse(result.rows[0]));
    }
  } catch (err) {
    console.log(err.message.split(":"));
    next(err.message);
  }
};

// units
module.exports.getUnits = async (req, res, next) => {
  try {
    const { search } = req.headers;
    const { page, limit } = req.query;
    if (!search) {
      res.json(createResponse(null, "Parameter required", true));
    } else {
      const result = await getUnits(search, page, limit);
      res.json(createResponse(result.rows));
    }
  } catch (err) {
    next(err.message);
  }
};

// single unit
module.exports.getSingleUnit = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const result = await getSingleUnit({ UNIT_ID: id });
      res.json(createResponse(result.rows[0]));
    }
  } catch (err) {
    next(err.message);
  }
};

// suppliers
module.exports.getSuppliers = async (req, res, next) => {
  try {
    const { search } = req.headers;
    const { page, limit } = req.query;

    if (!search) {
      res.json(createResponse(null, "Parameter required", true));
    } else {
      const result = await getSuppliers(search, page, limit);
      res.json(createResponse(result.rows));
    }
  } catch (err) {
    next(err.message);
  }
};

// single supplier
module.exports.getSingleSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const result = await getSingleSupplier({ SUP_ID: id });
      res.json(createResponse(result.rows[0]));
    }
  } catch (err) {
    next(err.message);
  }
};

// products
module.exports.getProducts = async (req, res, next) => {
  try {
    const { search } = req.headers;
    const { page, limit } = req.query;
    if (!search) {
      res.json(createResponse(null, "Parameter required", true));
    } else {
      const { rows } = await getProducts(search, page, limit);
      const { rows: count } = await getCountProducts();
      let totalCount = count[0];
      res.json(createResponse({ rows, totalCount }));
      y;
    }
  } catch (err) {
    next(err.message);
  }
};

// single product
module.exports.getSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const result = await getSingleProduct({ PRODID: id });
      res.json(createResponse(result.rows[0]));
    }
  } catch (err) {
    next(err.message);
  }
};

// get product by cat id
module.exports.getProductByCatId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { search } = req.headers;
    const { page, limit } = req.query;
    if (!id) {
      res.json(createResponse(null, "Id required", true));
    } else {
      const result = await getProductByCatId({
        CAT_ID: id,
        search,
        page,
        limit,
      });
      res.json(createResponse(result.rows));
    }
  } catch (err) {
    next(err.message);
  }
};

// product category with length
module.exports.getCategoryWithLength = async (req, res, next) => {
  try {
    const result = await getCategoryWithLength();
    res.json(createResponse(result.rows));
  } catch (err) {
    next(err.message);
  }
};

/*------------- End ---------------*/

/*------------- All Post Routes ---------------*/

// category
module.exports.postCategory = async (req, res, next) => {
  try {
    const { categoryen } = req.body;
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
    const { supplier } = req.body;
    if (!supplier) {
      res.json(createResponse(null, "Supplier name is required", true));
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
    const { proname, pronametwo, procate } = req.body;
    if (!proname && !pronametwo && !procate) {
      res.json(createResponse(null, "Fields required", true));
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
    const { categoryen, categorybn } = req.body;
    const { cat_id } = req.headers;

    if (!categoryen || !cat_id) {
      res.json(createResponse(null, "Fields required", true));
    } else {
      const data = {
        CATEGORYEN: categoryen,
        CATEGORYBN: categorybn,
        CAT_ID: parseInt(cat_id),
      };
      const result = await updateCategory(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateUnits = async (req, res, next) => {
  try {
    const { unit } = req.body;
    const { unit_id } = req.headers;
    if (!unit || !unit_id) {
      res.json(createResponse(null, "Fields required", true));
    } else {
      const data = { UNIT: unit, UNIT_ID: unit_id };
      const result = await updateUnits(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateSupplier = async (req, res, next) => {
  try {
    const { supplier } = req.body;
    const { sup_id } = req.headers;
    if (!supplier && sup_id) {
      res.json(createResponse(null, "Fields required", true));
    } else {
      const data = { SUPPLIER: supplier, SUP_ID: sup_id };
      const result = await updateSupplier(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateProducts = async (req, res, next) => {
  try {
    const { proname, pronametwo, procate } = req.body;
    const { prodid } = req.headers;
    if (!proname && !pronametwo && procate && prodid) {
      res.json(createResponse(null, "Fields required", true));
    } else {
      const data = {
        PRONAME: proname,
        PRONAMETWO: pronametwo,
        PROCATE: procate,
        PRODID: prodid,
      };
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
