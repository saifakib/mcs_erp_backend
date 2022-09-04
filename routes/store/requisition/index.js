const router = require("express").Router();
const requisitionController = require("../../../controllers/store/requisition");

// get route
router.get("/last_id", requisitionController.getLastReqId);

// post route
router.post("/new", requisitionController.postRequisition);

module.exports = router;
