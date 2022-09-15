const router = require("express").Router();
const requisitionRoute = require("./requisition");
const settingsRoute = require("./settings");
const productsRoute = require("./product");
const supplierRoute = require("./mrr");
const reportsRoute = require('./reports');
const wareHouseRoute = require('./warehouse');

router.use("/settings", settingsRoute);
router.use("/requisition", requisitionRoute);
router.use("/products", productsRoute);
router.use("/mrr", supplierRoute);
router.use("/reports", reportsRoute);
router.use("/warehouse", wareHouseRoute);


module.exports = router;
