const { createResponse } = require("../../utils/responseGenerator");
const Joi = require('joi');
const { errorResponse } = require("../../utils/errorRespnose");


const checkCategory = (req, res, next) => {

    let categorySchema = {}
    let headers = {}

    if (req.method == 'POST') {
        categorySchema = Joi.object().keys({
            category_name: Joi.string().min(2).required(),
        })
    }
    else if (req.method == 'PUT') {
        const { category_id } = req.headers;
        headers = { category_id }
        categorySchema = Joi.object().keys({
            category_id: Joi.number().required(),
            category_name: Joi.string().min(3).required(),
        })
    }
    else if (req.method == 'DELETE') {
        const { category_id } = req.headers;
        headers = { category_id }
        categorySchema = Joi.object().keys({
            category_id: Joi.number().required(),
        })
    }

    const { error } = categorySchema.validate({ ...req.body, ...headers });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

module.exports = {
    checkCategory
}

