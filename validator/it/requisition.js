const { createResponse } = require("../../utils/responseGenerator");
const Joi = require('joi');
const { errorResponse } = require("../../utils/errorRespnose");


const checkPostRequisition = (req, res, next) => {
    let checkUserRequisitionSchema = {}

    if (req.method == 'POST') {
        const { user_id } = req.headers;
        headers = { user_id }
        checkUserRequisitionSchema = Joi.object().keys({
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
    const { error } = checkUserRequisitionSchema.validate({ ...req.body, ...headers });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};


module.exports = {
    checkPostRequisition
}

