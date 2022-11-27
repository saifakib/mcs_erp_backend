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


const checkProductList = (req, res, next) => {

    let productSchema = {}
    let headers = {}

    if (req.method == 'POST') {
        productSchema = Joi.object().keys({
            product_name: Joi.string().min(2).required(),
            category_id: Joi.number().required()
        })
    }
    else if (req.method == 'PUT') {
        const { product_id } = req.headers;
        headers = { product_id }
        productSchema = Joi.object().keys({
            product_id: Joi.number().required(),
            category_id: Joi.number().required(),
            product_name: Joi.string().min(3).required(),
        })
    }
    else if (req.method == 'DELETE') {
        const { product_id } = req.headers;
        headers = { product_id }
        productSchema = Joi.object().keys({
            product_id: Joi.number().required(),
        })
    }

    const { error } = productSchema.validate({ ...req.body, ...headers });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

module.exports = {
    checkCategory,
    checkProductList
}

