const router = require("express").Router();

const settingsRoute = require("./settings");
const productsRoute = require("./product");
const mrrRoute = require("./mrr");
const requisitionRoute = require("./requisition")


router.use("/settings", settingsRoute);
router.use("/products", productsRoute);
router.use("/mrr", mrrRoute);
router.use("/requisition", requisitionRoute);


module.exports = router;