const { createResponse } = require("../../../utils/responseGenerator");
const { categories, selectCategory, insertCategory, updateCategory, deleteCategory } = require("../../../services/it/settings")


/*------------- All Get Routes ---------------*/
const getCategories = async (req, res) => {
    const { search } = req.headers;
    const { page, limit } = req.query;
    if (!search) {
        res.json(createResponse(null, "Parameter required", true));
    } else {
        const result = await categories(search, page, limit);
        res.json(createResponse(result.rows));
    }
};

const getCategory = async (req, res) => {
    const { category_id } = req.params;
    const result = await selectCategory(category_id);
    res.json(createResponse(result.rows));
};



/*------------- All Post Routes ---------------*/
const postCategory = async (req, res, next) => {
    try {
        const result = await insertCategory(req.body);
        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};


/*------------- All Update Routes ---------------*/
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

/*------------- All Delete Routes ---------------*/
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


module.exports = {
    getCategories,
    getCategory,
    postCategory,
    putCategory,
    removeCategory
}