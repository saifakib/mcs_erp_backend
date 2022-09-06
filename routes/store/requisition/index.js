const router = require("express").Router();
const requisitionController = require("../../../controllers/store/requisition");

// get route
router.get("/last_id", requisitionController.getLastReqId);

// post route
router.post("/new", requisitionController.postRequisition);

// update route
router.put("/admin_approve", requisitionController.updateRequisitionByAdmin);
router.put(
  "/storeOfficer_approve",
  requisitionController.updateReqByStoreOfficer
);

module.exports = router;
