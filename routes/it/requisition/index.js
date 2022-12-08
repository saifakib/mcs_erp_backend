const router = require("express").Router();
const { postRequisition } = require("../../../controllers/it/requisition")

// post route
router.post("/", postRequisition)

module.exports = router;