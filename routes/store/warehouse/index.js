const router = require("express").Router();
const {
  requisitionInfoWithStatusCount,
  stockAlertList,
  requisitionStatusForAdmin,
} = require("../../../controllers/store/warehouse");

// get route
router.get("/", requisitionInfoWithStatusCount);
router.get("/admin/dashboard", requisitionStatusForAdmin);
router.get("/stockAlert", stockAlertList);

module.exports = router;
