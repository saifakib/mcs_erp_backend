const router = require("express").Router();
const { validateToken } = require("../../utils/JWT");
const departmentRoute = require("./department");
const employeeRoute = require("./employee");
const user = require("./user");

router.use("/department", validateToken, departmentRoute);
router.use("/employee", validateToken, employeeRoute);
router.use("/user", validateToken, user);

module.exports = router;
