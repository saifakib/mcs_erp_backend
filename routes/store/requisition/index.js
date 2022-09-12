const router = require("express").Router();
const requisitionController = require("../../../controllers/store/requisition");

// get route
router.get("/:id", requisitionController.getRequisitionById);
router.get("/details/:id", requisitionController.getRequisitionDetailsById);

// post route
router.post("/", requisitionController.postRequisition);
router.post("/manual", requisitionController.createManualRequisition);

// update route
router.put("/approve/admin", requisitionController.updateRequisitionByAdmin);
router.put(
  "/approve/store_officer",
  requisitionController.updateReqByStoreOfficer
);

module.exports = router;
