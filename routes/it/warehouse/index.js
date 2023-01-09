const router = require("express").Router();
const {
  requisitionInfoWithStatusCount,
  getStockAlertList,
  requisitionStatusForAdmin,
  userDashboardInfo
} = require("../../../controllers/it/warehouse");

// get route
router.get("/", requisitionInfoWithStatusCount);
router.get("/admin/dashboard", requisitionStatusForAdmin);
router.get("/stockAlert", getStockAlertList);
router.get("/user/:hrid", userDashboardInfo)

module.exports = router;
