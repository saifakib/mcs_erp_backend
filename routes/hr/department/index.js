const router = require("express").Router();
const { getDepartments } = require("../../../controllers/hr/department");
const { getEmpByDeptId } = require("../../../controllers/hr/employee")

// get route
router.get("/", getDepartments);
router.get("/:deptid/employees", getEmpByDeptId)

module.exports = router;
