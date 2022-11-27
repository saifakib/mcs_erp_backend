const { createResponse } = require("../../../utils/responseGenerator");
const { categories, selectCategory, insertCategory, updateCategory, deleteCategory, productLists,
    getCountProductLists, selectProductLists, insertProduct, updateputProductLists, deleteProductLists, models, selectModel, insertModel, updateModel, deleteModel, specifications, selectSpecification, insertSpecification, updateSpecification, deleteSpecification } = require("../../../services/it/settings")


/*------------- All Get Controllers ---------------*/

// Category
const getCategories = async (req, res) => {
    try {
        const { search } = req.headers;
        const { page, limit } = req.query;
        if (!search) {
            res.json(createResponse(null, "Headers required", true));
        } else {
            const result = await categories(search, page, limit);
            res.json(createResponse(result.rows));
        }
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
const getProductLists = async (req, res, next) => {
    try {
        const { search } = req.headers;
        const { page, limit } = req.query;
        if (!search) {
            res.json(createResponse(null, "Headers required", true));
        } else {
            const result = await productLists(search, page, limit);
            res.json(createResponse(result.rows));
        }
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
        const result = await deleteModel(data);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCategories,getCategory,postCategory,putCategory,removeCategory,
    getProductLists,getProduct,postProductLists,putProductLists,removeProductLists,
    getModels,getModel,postModel,putModel,removeModel,
    getSpecifications,getSpecification,postSpecification,putSpecifications,removeSpecification,
    
}