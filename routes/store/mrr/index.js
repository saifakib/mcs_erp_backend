const router = require("express").Router();
const { manageSupplier } = require("../../../controllers/store/mrr")

// get route
router.get("/manageSupplier", manageSupplier);

module.exports = router;
