const router = require("express").Router();
const requisitionRoute = require("./requisition");
const settingsRoute = require("./settings");
const productsRoute = require("./product");
const supplierRoute = require("./mrr");
const reportsRoute = require("./reports");
const wareHouseRoute = require("./warehouse");
const logActivityRoute = require("./logActivity");
const permissionRoute = require("./systemAccess");
const { checkBoth } = require("../../middlewares/checkAuthorization");

router.use("/settings", checkBoth, settingsRoute);
router.use("/requisition", requisitionRoute);
router.use("/products", productsRoute);
router.use("/mrr", checkBoth, supplierRoute);
router.use("/reports", reportsRoute);
router.use("/warehouse", checkBoth, wareHouseRoute);
router.use("/logs", logActivityRoute);
router.use("/permission", permissionRoute);

module.exports = router;
