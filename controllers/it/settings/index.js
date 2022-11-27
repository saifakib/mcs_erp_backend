const { createResponse } = require("../../../utils/responseGenerator");
const { categories, selectCategory, insertCategory, updateCategory, deleteCategory, productLists,
    getCountProductLists, getSingleProductLists, insertProduct, updateputProductLists, deleteProductLists } = require("../../../services/it/settings")


/*------------- All Get Routes ---------------*/

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
        const result = await getSingleProductLists(product_id);
        res.json(createResponse(result.rows[0]));
    } catch (err) {
        next(err.message);
    }
};








/*------------- All Post Routes ---------------*/
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






/*------------- All Update Routes ---------------*/
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





/*------------- All Delete Routes ---------------*/
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


module.exports = {
    getCategories,
    getCategory,
    postCategory,
    putCategory,
    removeCategory,
    getProductLists,
    getProduct,
    postProductLists,
    putProductLists,
    removeProductLists
}