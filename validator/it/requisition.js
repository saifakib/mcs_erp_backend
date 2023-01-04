const { createResponse } = require("../../utils/responseGenerator");
const Joi = require('joi');
const { errorResponse } = require("../../utils/errorRespnose");


const checkUserRequisition = (req, res, next) => {
    let checkUserRequisitionSchema = {}

    if (req.method == 'GET') {
        const { user_id } = req.params;
        params = { user_id }
        checkUserRequisitionSchema = Joi.object().keys({
            user_id: Joi.number().required(),
        })
    }
    const { error } = checkUserRequisitionSchema.validate({ ...req.body, ...params });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

const checkUserAcceptRequisition = (req, res, next) => {
    let checkUserAccRequisitionSchema = {}

    if (req.method == 'GET') {
        const { user_id } = req.headers;
        headers = { user_id }
        checkUserAccRequisitionSchema = Joi.object().keys({
            user_id: Joi.number().required(),
        })
    }
    const { error } = checkUserAccRequisitionSchema.validate({ ...req.body, ...headers });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

const checkPostRequisition = (req, res, next) => {
    let checkPostRequisitionSchema = {}

    if (req.method == 'POST') {
        const { user_id } = req.headers;
        headers = { user_id }
        checkPostRequisitionSchema = Joi.object().keys({
            user_id: Joi.number().required(),
            remarks: Joi.string(),
            products: Joi.array().min(1).items(
                Joi.object().keys({
                    pro_id: Joi.number().required(),
                    prorequqty: Joi.number().required()
                }).required()
            ).unique((a, b) => a.pro_id === b.pro_id).required(),
        })
    }
    const { error } = checkPostRequisitionSchema.validate({ ...req.body, ...headers });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

const checkApproveRequisition = (req, res, next) => {
    let checkApproveRequisitionSchema = {}

    if (req.method == 'PUT') {
        checkApproveRequisitionSchema = Joi.object().keys({
            req_id: Joi.number().required(),
            str_remarks: Joi.string().allow(null, ''),
            products: Joi.array().min(1).items(
                Joi.object().keys({
                    pro_id: Joi.number(),
                    pro_req_id: Joi.number().required(),
                    str_pro_id: Joi.number().required(),
                    qty: Joi.number().required(),
                    reqQty: Joi.number()
                }).required()
            )
        })
    }
    const { error } = checkApproveRequisitionSchema.validate({ ...req.body });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

const checkAcceptRequisition = (req, res, next) => {
    let checkAcceptRequisitionSchema = {}

    if (req.method == 'PUT') {
        checkAcceptRequisitionSchema = Joi.object().keys({
            req_id: Joi.number().required()
        })
    }
    const { error } = checkAcceptRequisitionSchema.validate({ ...req.body });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

const checkDenyRequisition = (req, res, next) => {
    let checkDenyRequisitionSchema = {}

    if (req.method == 'PUT') {
        checkDenyRequisitionSchema = Joi.object().keys({
            req_id: Joi.number().required(),
            denyRemarks: Joi.string()
        })
    }
    const { error } = checkDenyRequisitionSchema.validate({ ...req.body });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};


module.exports = {
    checkUserRequisition,
    checkUserAcceptRequisition,
    checkPostRequisition,
    checkApproveRequisition,
    checkAcceptRequisition,
    checkDenyRequisition
}

