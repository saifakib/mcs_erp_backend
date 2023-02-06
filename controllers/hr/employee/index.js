const { createResponse } = require("../../../utils/responseGenerator");
const { getAllEmployee, getEmployee, getEmployeeByDeptId  } = require("../../../services/hr/employee");



/*------------- All Get Controller ---------------*/

/**
 * Get Employee - All  
 */
 const getEmployees = async (req, res, next) => {
    try {
        const employees = await getAllEmployee();
        res.json(createResponse(employees.rows));

    } catch(err) {
        next(err)
    }
};

/**
 * Get Employee By Employeeid
 */
const getEmployeeById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const employees = await getEmployee(id);
        res.json(createResponse(employees.rows[0]));

    } catch(err) {
        next(err)
    }
};

/**
 * Get Employee By Department Id  
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
    getEmployees, getEmployeeById,
    getEmpByDeptId
};
