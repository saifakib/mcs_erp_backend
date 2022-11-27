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


const checkModel = (req, res, next) => {
    let modelSchema = {}
    let headers = {}

    if (req.method == 'POST') {
        modelSchema = Joi.object().keys({
            model_name: Joi.string().min(2).required(),
        })
    }
    else if (req.method == 'PUT') {
        const { model_id } = req.headers;
        headers = { model_id }
        modelSchema = Joi.object().keys({
            model_id: Joi.number().required(),
            model_name: Joi.string().min(2).required(),
        })
    }
    else if (req.method == 'DELETE') {
        const { model_id } = req.headers;
        headers = { model_id }
        modelSchema = Joi.object().keys({
            model_id: Joi.number().required(),
        })
    }

    const { error } = modelSchema.validate({ ...req.body, ...headers });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};


const checkSpecification = (req, res, next) => {
    let specificationSchema = {}
    let headers = {}

    if (req.method == 'POST') {
        specificationSchema = Joi.object().keys({
            model_id: Joi.number().required(),
            name: Joi.string().min(2).required(),
            value: Joi.string().required(),
        })
    }
    else if (req.method == 'PUT') {
        const { specification_id } = req.headers;
        headers = { specification_id }
        specificationSchema = Joi.object().keys({
            specification_id: Joi.number().required(),
            name: Joi.string().min(2).required(),
            value: Joi.string().required(),
        })
    }
    else if (req.method == 'DELETE') {
        const { specification_id } = req.headers;
        headers = { specification_id }
        specificationSchema = Joi.object().keys({
            specification_id: Joi.number().required(),
        })
    }

    const { error } = specificationSchema.validate({ ...req.body, ...headers });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

module.exports = {
    checkCategory,
    checkProductList,
    checkModel,
    checkSpecification
}

