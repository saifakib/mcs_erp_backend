const router = require("express").Router();
const { postMaintanance, putMaintanance } = require("../../../controllers/it/maintanance");

router.get("/", postMaintanance);
router.put("/", putMaintanance);

module.exports = router;