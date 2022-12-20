const router = require("express").Router();
const { postMaintanance, postServicing, putMaintanance, putServicing } = require("../../../controllers/it/maintanance");

router.post("/", postMaintanance);
router.put("/", putMaintanance);

router.post("/servicing", postServicing);
router.put("/servicing", putServicing);

module.exports = router;