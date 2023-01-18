const { createResponse } = require("../../utils/responseGenerator");
const Joi = require('joi');
const { errorResponse } = require("../../utils/errorRespnose");


const checkLogActivity = (req, res, next) => {
    let logActivitySchema = {};

    logActivitySchema = Joi.object().keys({
        action_type: Joi.string().min(3).required(),
        log_detail: Joi.string()
    })
    const { error } = logActivitySchema.validate({ ...req.body });
    const valid = error == null;
    if (valid) { next() }
    else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

module.exports = { checkLogActivity }