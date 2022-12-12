const router = require("express").Router();
const { postRequisition, putReqByItStoreOfficer, denyRequisition } = require("../../../controllers/it/requisition");
const { checkPostRequisition } = require("../../../validator/it/requisition")

// post route
router.post("/", checkPostRequisition, postRequisition)

router.put("/approve", putReqByItStoreOfficer);
router.put("/deny", denyRequisition);

router.get("/user");
router.get("/admin/pending");
router.get("/admin/approve");
router.get("/admin/deliver");
router.get("/admin/deny");

module.exports = router;