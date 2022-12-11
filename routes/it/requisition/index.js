const router = require("express").Router();
const { postRequisition, putReqByItStoreOfficer, denyRequisition } = require("../../../controllers/it/requisition");
const { checkPostRequisition } = require("../../../validator/it/requisition")

// post route
router.post("/", checkPostRequisition, postRequisition)

router.put("/approve", putReqByItStoreOfficer);
router.put("/deny", denyRequisition);

module.exports = router;