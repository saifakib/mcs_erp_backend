const router = require("express").Router();
const {
  getAssetProducts,
  postAssetProducts,
  deleteAssetProducts,
  putAssetProducts,
  getAssetManual,
  postAssetManual,
  getAssetManualById,
  putAssetManual,
  putAssetManualStatus,
  getAssetManualPersonReport,
  getAssetManualDepartmentReport,
} = require("../../../controllers/it/asset");
const {
  checkAssetProduct,
  checkAssetManual,
} = require("../../../validator/it/asset");

router.route("/assetproduct")
  .get(getAssetProducts)
  .post(checkAssetProduct, postAssetProducts)
  .put(checkAssetProduct, putAssetProducts)
router.delete("/assetproduct/:id", deleteAssetProducts);


router.get("/assetmanual", getAssetManual);
router.get("/assetmanual/:id", getAssetManualById);
router.post("/assetmanual", checkAssetManual, postAssetManual);
router.put("/assetmanual", putAssetManual);
router.put("/assetmanual/status", putAssetManualStatus);
router.get("/assetmanual/report/person/:emp_id", getAssetManualPersonReport);
router.get("/assetmanual/report/department/:dep_id", getAssetManualDepartmentReport);


module.exports = router;