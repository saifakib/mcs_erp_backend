const router = require("express").Router();
const { getEmployees, getEmployeeById } = require("../../../controllers/hr/employee")

// get route
router.get("/", getEmployees);
router.get("/:id", getEmployeeById);


module.exports = router;
