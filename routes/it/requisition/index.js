const router = require("express").Router();
const { getUserRequitions, getUserAcceptRequitions, getAdminRequisitions, getRequsition, postRequisition, putReqByItStoreOfficer, denyRequisition, acceptUserRequisition } = require("../../../controllers/it/requisition");
const { checkUserRequisition, checkUserAcceptRequisition, checkPostRequisition } = require("../../../validator/it/requisition");

// post route
router.post("/", checkPostRequisition, postRequisition)

router.put("/approve", putReqByItStoreOfficer);
router.put("/deny", denyRequisition);
router.put("/accept", acceptUserRequisition);

router.get("/user/accReq", checkUserAcceptRequisition, getUserAcceptRequitions);
router.get("/user/:user_id", checkUserRequisition, getUserRequitions);

router.get("/admin", getAdminRequisitions);

router.get("/admin/:req_id", getRequsition)

module.exports = router;