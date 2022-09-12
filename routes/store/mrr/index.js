const router = require("express").Router();
const {
  manageSupplier,
  mrrProListBySupId,
  viewProductReceptBySupIdDate,
  lastEntryListByProListId,
  updateSingleProductEntriList,
  deleteSingleProductEntriList,
  singleProductEntriesBymrrno,
  updateProductEntriesBymrrno,
  addMoreMrr,
} = require("../../../controllers/store/mrr");

// get route
router.get("/manageSupplier", manageSupplier);
router.get("/supplierMrr/:sup_id", mrrProListBySupId);
router.get("/productRecept/:sup_id/:date", viewProductReceptBySupIdDate);
router.get("/lastEntryListByProListId/:list_id", lastEntryListByProListId);
router.get("/productEntriesByMrrno/:mrrno", singleProductEntriesBymrrno);
router.get("/addMoreMrr/:sup_id/:date", addMoreMrr);

// put route
//router.put('/productRecept/:sup_id/:date');
router.put("/singleProductEntriList", updateSingleProductEntriList);
router.put("/productEntriesByMrrno", updateProductEntriesBymrrno);

// delete route
router.delete("/singleProductEntriList", deleteSingleProductEntriList);

module.exports = router;
