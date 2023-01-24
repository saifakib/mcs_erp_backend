const router = require("express").Router();
const { validateToken } = require("../../middlewares/JWT");
const departmentRoute = require("./department");
const employeeRoute = require("./employee");
const user = require("./user");

router.use("/department", departmentRoute);
router.use("/employee", employeeRoute);
router.use("/user", validateToken, user);

module.exports = router;
