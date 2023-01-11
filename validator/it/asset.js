const { createResponse } = require("../../utils/responseGenerator");
const Joi = require("joi");
const { errorResponse } = require("../../utils/errorRespnose");

const checkAssetProduct = (req, res, next) => {
    let assetProductSchema = {};

    if (req.method == "POST") {
        assetProductSchema = Joi.object().keys({
            p_name: Joi.string().min(2).required()
        });
    } else if (req.method == "PUT") {
        assetProductSchema = Joi.object().keys({
            p_name: Joi.string().min(2).required()
        });
    }

    const { error } = assetProductSchema.validate({ ...req.body });
    const valid = error == null;
    if (valid) {
        next();
    } else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

const checkAssetManual = (req, res, next) => {
    let assetManualSchema = {};
    if (req.method == "POST") {
        assetManualSchema = Joi.object().keys({
            product_id: Joi.number().min(1).required(),
            employee_id: Joi.number().required(),
            details: Joi.string().allow("", null),
            quanity: Joi.number().required(),
            year: Joi.string().allow("", null),
            source: Joi.string().allow("", null),
            files: Joi.string().allow("", null)
        });
    }

    const { error } = assetManualSchema.validate({ ...req.body });
    const valid = error == null;
    if (valid) {
        next();
    } else {
        res.json(createResponse(errorResponse(error), "Error Occured", true));
    }
};

module.exports = {
    checkAssetProduct,
    checkAssetManual,
};