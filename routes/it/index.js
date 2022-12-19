const router = require("express").Router();

const settingsRoute = require("./settings");
const productsRoute = require("./product");
const mrrRoute = require("./mrr");
const requisitionRoute = require("./requisition");
const maintananceRoute = require("./maintanance");
const reportRoute = require("./report")


router.use("/settings", settingsRoute);
router.use("/products", productsRoute);
router.use("/mrr", mrrRoute);
router.use("/requisition", requisitionRoute);
router.use("/reports", reportRoute);
router.use("/maintanance", maintananceRoute);


module.exports = router;