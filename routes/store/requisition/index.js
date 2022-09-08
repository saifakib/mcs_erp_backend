const router = require("express").Router();
const requisitionController = require("../../../controllers/store/requisition");

// get route
// router.get("/last_id", requisitionController.getLastReqNo);
router.get("/:id", requisitionController.getRequisitionById);
router.get("/details/:id", requisitionController.getRequisitionDetailsById);

// post route
router.post("/", requisitionController.postRequisition);

// update route
router.put("/admin/approve", requisitionController.updateRequisitionByAdmin);
router.put(
  "/approve/store_officer",
  requisitionController.updateReqByStoreOfficer
);

module.exports = router;
