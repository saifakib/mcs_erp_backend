const router = require("express").Router();
const { getUserRequitions, getUserReqIsPending, getUserAcceptRequitions, getUserAcceptRequition, getUserAcceptActiveRequitions, getAdminRequisitions, getRequsition, getAllDetailsRequisition, postRequisition, putReqByItStoreOfficer, denyRequisition, acceptUserRequisition, putRequisitionGivenStatus, putIndRequisition } = require("../../../controllers/it/requisition");
const { checkUserRequisition, checkUserAcceptRequisition, checkPostRequisition, checkApproveRequisition, checkDenyRequisition, checkAcceptRequisition } = require("../../../validator/it/requisition");

// post route
router.post("/", checkPostRequisition, postRequisition)

router.put("/approve", checkApproveRequisition, putReqByItStoreOfficer);
router.put("/deny", checkDenyRequisition, denyRequisition);
router.put("/accept", checkAcceptRequisition, acceptUserRequisition);

// Given Not Given
router.put("/given/:id", putRequisitionGivenStatus);

router.get("/admin", getAdminRequisitions);

router.get("/admin/:req_id", getRequsition)

router.get("/user/accReq", checkUserAcceptRequisition, getUserAcceptRequitions);
router.get("/user/accReq/active", checkUserAcceptRequisition, getUserAcceptActiveRequitions);
router.get("/user/:user_id", checkUserRequisition, getUserRequitions);
router.get("/:req_id", getUserAcceptRequition);
router.get("/details/:req_id", getAllDetailsRequisition);



// User Requsition Is Pending Until Accept
router.get("/isPending/:user_id", getUserReqIsPending);


// Update Individual Pro Requisition 
router.put("/individual/:ind_pro_req_id", putIndRequisition);


module.exports = router;