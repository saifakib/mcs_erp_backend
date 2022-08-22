const router = require("express").Router();
const setting = require("./settings");
const productRoute = require('./product')

router.use("/settings", setting);
router.use("/product", productRoute);

module.exports = router;
