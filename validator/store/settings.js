const { createResponse } = require("../../utils/responseGenerator");

 const checkCatPostName = (req, res, next) => {
    const { categoryen } = req.body;

    if(typeof(categoryen) != 'string') {
        res.json(createResponse("","Body type doesn't match",true))
    }
    else {
        next();
    }
}


const checkCatPostUnit = (req, res, next) => {
    const { unit } = req.body;

    if(typeof(unit) != 'string') {
        res.json(createResponse("","Body type doesn't match",true))
    }
    else {
        next();
    }
}

const checkCatPostSupplier = (req, res, next) => {
    const { supplier } = req.body;

    if(typeof(supplier) != 'string') {
        res.json(createResponse("","Body type doesn't match",true))
    }
    else {
        next();
    }
}

const checkCatPostProducts = (req, res, next) => {
    const { proname, pronametwo, procate } = req.body;

    if(typeof(proname) != 'string' || typeof(pronametwo) != 'string' || typeof(procate) != 'number') {
        res.json(createResponse("","Body type doesn't match",true))
    }
    else {
        next();
    }
}



module.exports = { checkCatPostName, checkCatPostUnit, checkCatPostSupplier, checkCatPostProducts };