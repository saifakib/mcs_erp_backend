const router = require("express").Router();
const { requisitionInfoWithStatusCount, stockAlertList } = require("../../../controllers/store/warehouse");

// get route
router.get("/", requisitionInfoWithStatusCount);
router.get("/stockAlert", stockAlertList);

module.exports = router;
