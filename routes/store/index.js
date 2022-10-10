const router = require("express").Router();
const requisitionRoute = require("./requisition");
const settingsRoute = require("./settings");
const productsRoute = require("./product");
const supplierRoute = require("./mrr");
const reportsRoute = require('./reports');
const wareHouseRoute = require('./warehouse');

const { checkBoth } = require('../../middlewares/checkAuthorization')

router.use("/settings", checkBoth, settingsRoute);
router.use("/requisition", requisitionRoute);
router.use("/products", productsRoute);
router.use("/mrr", checkBoth, supplierRoute);
router.use("/reports", checkBoth, reportsRoute);
router.use("/warehouse", checkBoth, wareHouseRoute);


module.exports = router;
