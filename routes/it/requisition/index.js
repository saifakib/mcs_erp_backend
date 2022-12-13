const router = require("express").Router();
const { getUserRequitions, getAdminRequisitions, postRequisition, putReqByItStoreOfficer, denyRequisition } = require("../../../controllers/it/requisition");
const { checkUserRequisition, checkPostRequisition } = require("../../../validator/it/requisition")

// post route
router.post("/", checkPostRequisition, postRequisition)

router.put("/approve", putReqByItStoreOfficer);
router.put("/deny", denyRequisition);

router.get("/user/:user_id", checkUserRequisition, getUserRequitions);
router.get("/admin", getAdminRequisitions);

module.exports = router;