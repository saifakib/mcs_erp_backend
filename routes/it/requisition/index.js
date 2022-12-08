const router = require("express").Router();
const { postRequisition, putReqByItStoreOfficer, denyRequisition } = require("../../../controllers/it/requisition");

// post route
router.post("/", postRequisition)

router.put("/approve", putReqByItStoreOfficer);
router.put("/deny", denyRequisition);

module.exports = router;