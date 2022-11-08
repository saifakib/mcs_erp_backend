const { createResponse } = require("../../../utils/responseGenerator");
const { getAllDepartments } = require("../../../services/hr/department");

/*------------- All Get Controller ---------------*/

/**
 * Department - All
 */
const getDepartments = async (req, res, next) => {
    // const { search } = req.headers;
    // const { page, limit } = req.query;
    try {
        // if (!search) {
        //     res.json(createResponse(null, "Parameter required", true));
        // }
        // else {
        //     const departments = await getAllDepartments(search, page, limit);
        //     res.json(createResponse(departments.rows));
        // }
        const departments = await getAllDepartments();
        res.json(createResponse(departments.rows));
        
    } catch(err) {
        next(err)
    }
};

/*------------- End Get Controller ---------------*/

module.exports = {
  getDepartments,
};
