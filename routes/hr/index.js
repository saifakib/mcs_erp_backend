const router = require("express").Router();
const departmentRoute = require("./department");
const employeeRoute = require("./employee");
const user = require("./user");

router.use("/department", departmentRoute);
router.use("/employee", employeeRoute);
router.use("/user", user);

module.exports = router;
