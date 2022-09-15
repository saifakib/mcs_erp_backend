const router = require("express").Router();
const { requisitionInfoWithStatusCount } = require("../../../controllers/store/warehouse");

// get route
router.get("/", requisitionInfoWithStatusCount);

module.exports = router;
