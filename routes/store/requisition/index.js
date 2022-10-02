const router = require("express").Router();
const requisitionController = require("../../../controllers/store/requisition");

// get route
router.get("/:id", requisitionController.getRequisitionById);
router.get("/details/:id", requisitionController.getRequisitionDetailsById);

// is pending
router.get("/check_pending/:employe_id", requisitionController.isReqPending);

// pending
router.get("/pending/all", requisitionController.pendingRequisitions);
router.get("/pending/:id", requisitionController.pendingRequisitionDetails);

// approved
router.get("/approved/all", requisitionController.approvedRequisitions);
router.get("/approved/:id", requisitionController.approvedRequisitionDetails);

// done
router.get("/done/all", requisitionController.doneRequisitions);
router.get("/done/:id", requisitionController.doneRequisitionsDetails);

// denied
router.get("/denied/all", requisitionController.deniedRequisitions);
router.get("/denied/:id", requisitionController.deniedRequisitionsDetails);

// post route
router.post("/", requisitionController.postRequisition);
router.post("/manual", requisitionController.createManualRequisition);

// update route
router.put("/approve/admin", requisitionController.updateRequisitionByAdmin);
router.put("/deny/admin", requisitionController.denyRequisition);

router.put(
  "/approve/store_officer",
  requisitionController.updateReqByStoreOfficer
);

router.put("/acceptByUser", requisitionController.reqAcceptByUser);

module.exports = router;
