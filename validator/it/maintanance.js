const { createResponse } = require("../../utils/responseGenerator");
const Joi = require('joi');
const { errorResponse } = require("../../utils/errorRespnose");


const checkMaintanance = (req, res, next) => {
    let checkMaintananceSchema = {}

    if (req.method == 'POST') {
        checkMaintananceSchema = Joi.object().keys({
            user_id: Joi.number().required(),
            ind_pro_id: Joi.number().required(),
            ind_pro_req_id: Joi.number().required(),
            user_remarks: Joi.string().required()
        })
    }
    else if (req.method == 'PUT') {
        checkMaintananceSchema = Joi.object().keys({
            status: Joi.number().required(),
            maintanance_id: Joi.number().required()
        })
    }

    const { error } = checkMaintananceSchema.validate({ ...req.body });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

const checkServicing = (req, res, next) => {
    let checkServicingSchema = {}

    if (req.method == 'POST') {
        checkServicingSchema = Joi.object().keys({
            maintanance_id: Joi.number().required(),
            problem: Joi.string().required()
        })
    }
    else if (req.method == 'PUT') {
        checkServicingSchema = Joi.object().keys({
            maintanance_id: Joi.number().required(),
            remarks: Joi.string().required(),
            cost: Joi.number().required()
        })
    }

    const { error } = checkServicingSchema.validate({ ...req.body });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};


module.exports = { checkMaintanance, checkServicing }