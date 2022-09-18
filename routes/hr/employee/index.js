const router = require("express").Router();
const { getEmployees } = require("../../../controllers/hr/employee")

// get route
router.get("/", getEmployees);

module.exports = router;
