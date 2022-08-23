const router = require("express").Router();
const settingsRoute = require("./settings");
const productsRoute = require("./product");

router.use("/settings", settingsRoute);
router.use("/product", productsRoute);

module.exports = router;
