const router = require("express").Router();
const requisitionRoute = require("./requisition");
const settingsRoute = require("./settings");
const productsRoute = require("./product");
const supplierRoute = require("./mrr");

router.use("/settings", settingsRoute);
router.use("/requisition", requisitionRoute);
router.use("/products", productsRoute);
router.use("/mrr", supplierRoute);

module.exports = router;
