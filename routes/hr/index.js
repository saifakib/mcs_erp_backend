const router = require("express").Router();
const departmentRoute = require("./department");

router.use("/department", departmentRoute);

module.exports = router;
