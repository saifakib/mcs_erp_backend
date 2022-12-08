const router = require("express").Router();

const { manageSupplier, mrrProListBySupId, viewProductReceptBySupIdMrr } = require("../../../controllers/it/mrr")
 
router.get("/manage/supplier", manageSupplier);
router.get("/manage/supplier/:supplier_id", mrrProListBySupId);
router.get("/manage/supplier/:supplier_id/productrecept/:mrr_no",viewProductReceptBySupIdMrr);

module.exports = router;
