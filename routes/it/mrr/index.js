const router = require("express").Router();

const { manageSupplier, mrrProListBySupId } = require("../../../controllers/it/mrr")
 
router.get("/manage/supplier", manageSupplier);
router.get("/manage/supplier/:supplier_id", mrrProListBySupId);

module.exports = router;
