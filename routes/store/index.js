const router = require("express").Router();
const setting = require("./settings");

router.use("/settings", setting);

module.exports = router;
