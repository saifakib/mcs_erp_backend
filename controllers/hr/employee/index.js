const { createResponse } = require("../../../utils/responseGenerator");
const {  getEmployeeByDeptId  } = require("../../../services/hr/employee");



/*------------- All Get Controller ---------------*/

/**
 * Department - All 
 */
const getEmpByDeptId = async (req, res, next) => {
    const { deptid } = req.params;
    try {
        if (!deptid) {
            res.json(createResponse(null, "Parameter required", true));
        }
        else {
            const employees = await getEmployeeByDeptId(deptid);
            res.json(createResponse(employees.rows));
        }
        
    } catch(err) {
        next(err)
    }
};


/*------------- End Get Controller ---------------*/

module.exports = {
    getEmpByDeptId
};
