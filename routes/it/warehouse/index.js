const router = require("express").Router();
const {
  requisitionInfoWithStatusCount,
  getStockAlertList,
  requisitionStatusForAdmin,
} = require("../../../controllers/it/warehouse");

// get route
router.get("/", requisitionInfoWithStatusCount);
router.get("/admin/dashboard", requisitionStatusForAdmin);
router.get("/stockAlert", getStockAlertList);

module.exports = router;
