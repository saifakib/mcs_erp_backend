const router = require("express").Router();
const requisitionController = require("../../../controllers/store/requisition");
const {
  checkStoreAdmin,
  checkBoth,
  checkStoreManagers,
} = require("../../../middlewares/checkAuthorization");

// get route
router.get("/:id", requisitionController.getRequisitionById);
router.get("/details/:id", requisitionController.getRequisitionDetailsById);

// is pending
router.get("/check_pending/:employe_id", requisitionController.isReqPending);

// pending
router.get(
  "/pending/all",
  checkBoth,
  requisitionController.pendingRequisitions
);
router.get(
  "/pending/:id",
  checkBoth,
  requisitionController.pendingRequisitionDetails
);

// approved
router.get(
  "/approved/all",
  checkBoth,
  requisitionController.approvedRequisitions
);
router.get(
  "/approved/:id",
  checkBoth,
  requisitionController.approvedRequisitionDetails
);

// done
router.get("/done/all", checkBoth, requisitionController.doneRequisitions);
router.get("/done/:id", requisitionController.doneRequisitionsDetails);

// denied
router.get("/denied/all", checkBoth, requisitionController.deniedRequisitions);
router.get(
  "/denied/:id",
  checkBoth,
  requisitionController.deniedRequisitionsDetails
);

// roles
router.get("/roles/all", checkStoreAdmin, requisitionController.getStoreRoles);
router.get(
  "/roles/id/:id",
  checkStoreAdmin,
  requisitionController.singleStoreRoles
);

// post route
router.post("/", requisitionController.postRequisition);
router.post(
  "/manual",
  checkStoreManagers,
  requisitionController.createManualRequisition
);

// update route
router.put(
  "/approve/admin",
  checkStoreAdmin,
  requisitionController.updateRequisitionByAdmin
);
router.put(
  "/deny/admin",
  checkStoreAdmin,
  requisitionController.denyRequisition
);

router.put(
  "/approve/store_officer",
  checkStoreManagers,
  requisitionController.updateReqByStoreOfficer
);

router.put("/acceptByUser", requisitionController.reqAcceptByUser);

// update roles
router.put(
  "/roles/:id",
  checkStoreAdmin,
  requisitionController.updateStoreRoles
);

module.exports = router;
