const router = require("express").Router();

const settingsRoute = require("./settings");
const productsRoute = require("./product");
const mrrRoute = require("./mrr");


router.use("/settings", settingsRoute);
router.use("/products", productsRoute);
router.use("/mrr", mrrRoute);


module.exports = router;