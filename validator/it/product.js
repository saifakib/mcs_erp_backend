const { createResponse } = require("../../utils/responseGenerator");
const Joi = require('joi');
const { errorResponse } = require("../../utils/errorRespnose");


const checkProdEntries = (req, res, next) => {
    let checkProdEntriesSchema = {}

    if (req.method == 'POST') {
        checkProdEntriesSchema = Joi.object().keys({
            supplier_id: Joi.number().required(),
            user_id: Joi.number().required(),
            workorder: Joi.string().required(),
            cashmemono: Joi.string().required(),
            workorderdate: Joi.date().required(),
            suppdate: Joi.date().required(),
            cashmemodate: Joi.date().required(),
            products: Joi.array().min(1).items(
                Joi.object().keys({
                    model_id: Joi.number().required(),
                    pro_id: Joi.number().required(),
                    brand_id: Joi.number().required(),
                    unit_id: Joi.number().required(),
                    qty: Joi.number().min(0).required(),
                    non_workable: Joi.number().min(0).default(0).required(),
                    price: Joi.number().required(),
                    stock_alert: Joi.number().min(1).required(),
                    remarks: Joi.string(),
                }).required()
            ).unique((a, b) => a.pro_id === b.pro_id).required(),

        })
    }
    const { error } = checkProdEntriesSchema.validate({ ...req.body });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

const checkStrProdList = async (req, res, next) => {
    let strProdSchema = {}
    let headers = {}

    if (req.method == 'PUT') {
        const { str_pro_id } = req.headers;
        headers = { str_pro_id }
        strProdSchema = Joi.object().keys({
            str_pro_id: Joi.number().required(),
            qty: Joi.number().required(),
            price: Joi.number().required(),
            stock_alert: Joi.number().required(),
        })
    }
    const { error } = strProdSchema.validate({ ...req.body, ...headers });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
}

const checkIndProdList = async (req, res, next) => {
    let indProdSchema = {}
    let headers = {}

    if (req.method == 'PUT') {
        const { ind_product_id } = req.headers;
        headers = { ind_product_id }
        indProdSchema = Joi.object().keys({
            ind_product_id: Joi.number().required()
        })
    }
    const { error } = indProdSchema.validate({ ...headers });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
}


module.exports = {
    checkProdEntries,
    checkStrProdList,
    checkIndProdList
}

