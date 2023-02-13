const router = require("express").Router();
const {
  getAssetProducts, postAssetProducts, deleteAssetProducts, putAssetProducts, getUserNotExitProducts,
  getAssetManual, postAssetManual, getAssetManualById, putAssetManual, putAssetManualStatus, getAssetManualPersonReport,getAssetManualDepartmentReport, getAssetManualReturnReport,
} = require("../../../controllers/it/asset");
const {
  checkAssetProduct,
  checkAssetManual,
} = require("../../../validator/it/asset");

router.route("/assetproduct")
  .get(getAssetProducts)
  .post(checkAssetProduct, postAssetProducts)
  .put(checkAssetProduct, putAssetProducts)
router.get("/assetproduct/:employee_id", getUserNotExitProducts);
router.delete("/assetproduct/:id", deleteAssetProducts);

router.get("/assetmanual", getAssetManual);
router.get("/assetmanual/:id", getAssetManualById);
router.post("/assetmanual", checkAssetManual, postAssetManual);
router.put("/assetmanual", putAssetManual);
router.put("/assetmanual/status", putAssetManualStatus);
router.get("/assetmanual/report/person/:emp_id", getAssetManualPersonReport);
router.get("/assetmanual/report/department/:dep_id", getAssetManualDepartmentReport);

router.get("/assetmanual/return/report", getAssetManualReturnReport);


module.exports = router;