const router = require("express").Router();
const departmentRoute = require("./department");
const employeeRoute = require("./employee");

router.use("/department", departmentRoute);
router.use("/employee", employeeRoute);


module.exports = router;
