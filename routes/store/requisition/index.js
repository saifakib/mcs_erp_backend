const router = require("express").Router();
const requisitionController = require("../../../controllers/store/requisition");

// get route
<<<<<<< Updated upstream
// router.get("/last_id", requisitionController.getLastReqNo);
//router.get("/lastNumber", requisitionController.lastRequisitionNum)
=======
>>>>>>> Stashed changes
router.get("/:id", requisitionController.getRequisitionById);
router.get("/details/:id", requisitionController.getRequisitionDetailsById);


// post route
router.post("/", requisitionController.postRequisition);
router.post('/createmanualrequisition',);


// update route
router.put("/approve/admin", requisitionController.updateRequisitionByAdmin);
router.put(
  "/approve/store_officer",
  requisitionController.updateReqByStoreOfficer
);



module.exports = router;
