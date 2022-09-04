const router = require("express").Router();
const requisitionController = require("../../../controllers/store/requisition");

// get route
router.post("/new", requisitionController.postRequisition);

module.exports = router;
