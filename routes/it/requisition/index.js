const router = require("express").Router();
const { getUserRequitions, postRequisition, putReqByItStoreOfficer, denyRequisition } = require("../../../controllers/it/requisition");
const { checkUserRequisition, checkPostRequisition } = require("../../../validator/it/requisition")

// post route
router.post("/", checkPostRequisition, postRequisition)

router.put("/approve", putReqByItStoreOfficer);
router.put("/deny", denyRequisition);

router.get("/user", checkUserRequisition, getUserRequitions);
router.get("/admin/pending");
router.get("/admin/approve");
router.get("/admin/deliver");
router.get("/admin/deny");

module.exports = router;