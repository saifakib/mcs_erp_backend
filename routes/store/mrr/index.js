const router = require("express").Router();
const { manageSupplier, mrrProListBySupId, viewProductReceptBySupIdDate, lastEntryListByProListId, updateSingleProductEntriList, deleteSingleProductEntriList } = require("../../../controllers/store/mrr")

// get route
router.get("/manageSupplier", manageSupplier);
router.get('/supplierMrr/:sup_id', mrrProListBySupId);
router.get('/productRecept/:sup_id/:date', viewProductReceptBySupIdDate);
router.get('/lastEntryListByProListId/:list_id', lastEntryListByProListId)

// put route
//router.put('/productRecept/:sup_id/:date');
router.put('/updateSingleProductEntriList', updateSingleProductEntriList)



// delete route
router.delete('/deleteSingleProductEntriList', deleteSingleProductEntriList)



module.exports = router;
