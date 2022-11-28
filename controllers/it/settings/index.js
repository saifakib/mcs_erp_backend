const { createResponse } = require("../../../utils/responseGenerator");
const { categories, selectCategory, insertCategory, updateCategory, deleteCategory, productLists,
    getCountProductLists, selectProductLists, insertProduct, updateputProductLists, deleteProductLists, models, selectModel, insertModel, updateModel, deleteModel, specifications, selectSpecification, insertSpecification, updateSpecification, deleteSpecification, units, selectUnit, insertUnit, updateUnit, deleteUnit, brands, selectBrand, insertBrand, updateBrand, deleteBrand, suppliers, selectSupplier, insertSupplier, updateSupplier, deleteSupplier } = require("../../../services/it/settings")


/*------------- All Get Controllers ---------------*/

// Category
const getCategories = async (_, res) => {
    try {
        const result = await categories();
        res.json(createResponse(result.rows));
    } catch (err) {
        next(err.message)
    }
};
const getCategory = async (req, res) => {
    try {
        const { category_id } = req.params;
        const result = await selectCategory(category_id);
        res.json(createResponse(result.rows));
    } catch (err) {
        next(err.message)
    }
};

// ProductLists
const getProductLists = async (_, res, next) => {
    try {
        const result = await productLists();
        res.json(createResponse(result.rows));
    } catch (err) {
        next(err.message)
    }
}
const getProduct = async (req, res, next) => {
    try {
        const { product_id } = req.params;
        const result = await selectProductLists(product_id);
        res.json(createResponse(result.rows[0]));
    } catch (err) {
        next(err.message);
    }
};

// Models
const getModels = async (_, res, next) => {
    try {
        const result = await models();
        res.json(createResponse(result.rows));
    } catch (err) {
        next(err.message)
    }
}
const getModel = async (req, res, next) => {
    try {
        const { model_id } = req.params;
        const result = await selectModel(model_id);
        res.json(createResponse(result.rows[0]));
    } catch (err) {
        next(err.message);
    }
};

// Specifications
const getSpecifications = async (_, res, next) => {
    try {
        const result = await specifications();
        res.json(createResponse(result.rows));
    } catch (err) {
        next(err.message)
    }
}
const getSpecification = async (req, res, next) => {
    try {
        const { specification_id } = req.params;
        const result = await selectSpecification(specification_id);
        res.json(createResponse(result.rows[0]));
    } catch (err) {
        next(err.message);
    }
};

// Units
const getUnits = async (_, res, next) => {
    try {
        const result = await units();
        res.json(createResponse(result.rows));
    } catch (err) {
        next(err.message);
    }
};
const getUnit = async (req, res, next) => {
    try {
        const { unit_id } = req.params;
        const result = await selectUnit(unit_id);
        res.json(createResponse(result.rows[0]));
    } catch (err) {
        next(err.message);
    }
};

// Brands
const getBrands = async (_, res, next) => {
    try {
        const result = await brands();
        res.json(createResponse(result.rows));
    } catch (err) {
        next(err.message);
    }
};
const getBrand = async (req, res, next) => {
    try {
        const { brand_id } = req.params;
        const result = await selectBrand(brand_id);
        res.json(createResponse(result.rows[0]));
    } catch (err) {
        next(err.message);
    }
};

// Suppliers
const getSuppliers = async (req, res, next) => {
    try {
        const result = await suppliers();
        res.json(createResponse(result.rows));
    } catch (err) {
        next(err.message);
    }
};
const getSupplier = async (req, res, next) => {
    try {
        const { supplier_id } = req.params;
        const result = await selectSupplier(supplier_id);
        res.json(createResponse(result.rows[0]));
    } catch (err) {
        next(err.message);
    }
};








/*------------- All Post Controllers ---------------*/
// Category
const postCategory = async (req, res, next) => {
    try {
        const result = await insertCategory(req.body);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// ProductLists
const postProductLists = async (req, res, next) => {
    try {
        const result = await insertProduct(req.body);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Models
const postModel = async (req, res, next) => {
    try {
        const result = await insertModel(req.body);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Specifications
const postSpecification = async (req, res, next) => {
    try {
        const result = await insertSpecification(req.body);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Units
const postUnit = async (req, res, next) => {
    try {
        const result = await insertUnit(req.body);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Brands
const postBrand = async (req, res, next) => {
    try {
        const result = await insertBrand(req.body);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Suppliers
const postSupplier = async (req, res, next) => {
    try {
        const result = await insertSupplier(req.body);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};








/*------------- All Update Controllers ---------------*/
// Category
const putCategory = async (req, res, next) => {
    try {
        const { category_name } = req.body;
        const { category_id } = req.headers;

        const data = {
            CATEGORY_NAME: category_name,
            CATEGORY_ID: parseInt(category_id),
        };
        const result = await updateCategory(data);
        res.json(createResponse(result));

    } catch (err) {
        next(err);
    }
};

// ProductLists
const putProductLists = async (req, res, next) => {
    try {
        const { product_name, category_id } = req.body;
        const { product_id } = req.headers;
        const data = {
            PRODUCT_NAME: product_name,
            CATEGORY_ID: category_id,
            PRODUCT_ID: product_id,
        };
        const result = await updateputProductLists(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Models
const putModel = async (req, res, next) => {
    try {
        const { model_name } = req.body;
        const { model_id } = req.headers;
        const data = {
            MODEL_ID: model_id,
            MODEL_NAME: model_name
        };
        const result = await updateModel(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Specifications
const putSpecifications = async (req, res, next) => {
    try {
        const { name, value } = req.body;
        const { specification_id } = req.headers;
        const data = {
            SPECIFICATION_ID: specification_id,
            NAME: name,
            VALUE: value
        };
        const result = await updateSpecification(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Units
const putUnit = async (req, res, next) => {
    try {
        const { unit_name, } = req.body;
        const { unit_id } = req.headers;
        const data = {
            UNIT_ID: unit_id,
            UNIT_NAME: unit_name,
        };
        const result = await updateUnit(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Brands
const putBrand = async (req, res, next) => {
    try {
        const { brand_name } = req.body;
        const { brand_id } = req.headers;
        const data = {
            BRAND_ID: brand_id,
            BRAND_NAME: brand_name,
        };
        const result = await updateBrand(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Suppliers
const putSupplier = async (req, res, next) => {
    try {
        const { sup_type, sup_name, sup_details } = req.body;
        const { supplier_id } = req.headers;
        const data = {
            SUP_ID: supplier_id,
            SUP_TYPE: sup_type,
            SUP_NAME: sup_name,
            SUPPLIER_DETAILS: sup_details
        };
        const result = await updateSupplier(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};



/*------------- All Delete Controllers ---------------*/
// Category
const removeCategory = async (req, res, next) => {
    try {
        const { category_id } = req.headers;
        const data = { CATEGORY_ID: category_id };
        const result = await deleteCategory(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// ProductLists
const removeProductLists = async (req, res, next) => {
    try {
        const { product_id } = req.headers;
        const data = { PRODUCT_ID: product_id };
        const result = await deleteProductLists(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Models
const removeModel = async (req, res, next) => {
    try {
        const { model_id } = req.headers;
        const data = { MODEL_ID: model_id };
        const result = await deleteModel(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Specifications
const removeSpecification = async (req, res, next) => {
    try {
        const { specification_id } = req.headers;
        const data = { SPECIFICATION_ID: specification_id };
        const result = await deleteSpecification(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Units
const removeUnit = async (req, res, next) => {
    try {
        const { unit_id } = req.headers;
        const data = { UNIT_ID: unit_id };
        const result = await deleteUnit(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Brands
const removeBrand = async (req, res, next) => {
    try {
        const { brand_id } = req.headers;
        const data = { BRAND_ID: brand_id };
        const result = await deleteBrand(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

// Suppliers
const removeSupplier = async (req, res, next) => {
    try {
        const { supplier_id } = req.headers;
        const data = { SUP_ID: supplier_id };
        const result = await deleteSupplier(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCategories, getCategory, postCategory, putCategory, removeCategory,
    getProductLists, getProduct, postProductLists, putProductLists, removeProductLists,
    getModels, getModel, postModel, putModel, removeModel,
    getSpecifications, getSpecification, postSpecification, putSpecifications, removeSpecification,
    getUnits, getUnit, postUnit, putUnit, removeUnit,
    getBrands, getBrand, postBrand, putBrand, removeBrand,
    getSuppliers, getSupplier, postSupplier, putSupplier, removeSupplier,

}