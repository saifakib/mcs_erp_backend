const { createResponse } = require("../../utils/responseGenerator");
const Joi = require('joi');
const { errorResponse } = require("../../utils/errorRespnose");


const checkProdEntries = (req, res, next) => {
    let checkProdEntriesSchema = {}

    if (req.method == 'POST') {
        checkProdEntriesSchema = Joi.object().keys({
            mrr_no: Joi.number().required(),
            supplier_id: Joi.number().required(),
            user_id: Joi.number().required(),
            workorder: Joi.string().required(),
            cashmemono: Joi.string().required(),
            suppdate: Joi.date().required(),
            cashmemodate: Joi.date().required(),
            products: Joi.array().min(1).items(
                Joi.object().keys({
                    model_id: Joi.number().required(),
                    pro_id: Joi.number().required(),
                    brand_id: Joi.number().required(),
                    unit_id: Joi.number().required(),
                    qty: Joi.number().min(0).required(),
                    price: Joi.number().required(),
                    stock_alert: Joi.number().min(1).required(),
                    remarks: Joi.string(),
                }).required()
            ).unique((a, b) => a.pro_id === b.pro_id).required()
        })
    }
    else if (req.method == 'PUT') {
        checkProdEntriesSchema = Joi.object().keys({
            mrr_no: Joi.number().required(),
            supplier_id: Joi.number().required(),
            user_id: Joi.number().required(),
            workorder: Joi.string().required(),
            cashmemono: Joi.string().required(),
            suppdate: Joi.date().required(),
            cashmemodate: Joi.date().required(),
            products: Joi.array().min(1).items(
                Joi.object().keys({
                    str_pro_id: Joi.number().required(),
                    qty: Joi.number().min(0).required(),
                    price: Joi.number().required(),
                }).required()
            ).unique((a, b) => a.str_pro_id === b.str_pro_id).required()
        })
    }
    const { error } = checkProdEntriesSchema.validate({ ...req.body });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};


module.exports = {
    checkPostProdEntries
}
