const router = require("express").Router();
const {
  manageSupplier,
  mrrProListBySupId,
  viewProductReceptBySupIdDate,
  viewProductReceptBySupIdMrrDate,
  viewProductReceptBySupIdMrr,
  lastEntryListByProListId,
  updateSingleProductEntriList,
  updateMrrAddedProduct,
  deleteSingleProductEntriList,
  singleProductEntriesBymrrno,
  updateProductEntriesBymrrno,
  addMoreMrr,
  getSingleEntry,
} = require("../../../controllers/store/mrr");

const { checkStoreAdmin } = require("../../../middlewares/checkStoreAuthorization");

// get route
router.get("/manageSupplier", manageSupplier);
router.get("/supplierMrr/:sup_id", mrrProListBySupId);
router.get("/productRecept/:sup_id/:date", viewProductReceptBySupIdDate);
router.get(
  "/productrecept/:sup_id/:mrrno/:date",
  viewProductReceptBySupIdMrrDate
);
router.get("/productReceptBySupIdMrr/:sup_id/:mrrno", viewProductReceptBySupIdMrr);

router.get("/lastEntryListByProListId/:list_id", lastEntryListByProListId);
router.get("/productEntriesByMrrno/:mrrno", singleProductEntriesBymrrno);
router.get("/addMoreMrr/:sup_id/:date", addMoreMrr);
router.put("/addMoreMrr", updateMrrAddedProduct);

router.get("/getSingleEntry/:proid/:prolistid", getSingleEntry);

// put route
//router.put('/productRecept/:sup_id/:date');
router.put("/singleProductEntriList", updateSingleProductEntriList);
router.put("/productEntriesByMrrno", updateProductEntriesBymrrno);


// delete route
router.delete("/singleProductEntriList", deleteSingleProductEntriList);

module.exports = router;
