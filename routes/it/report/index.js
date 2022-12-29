const router = require("express").Router();
const {
    getEntriesProductReport, getRequisitionReport, getMaintananceReport
} = require("../../../controllers/it/report");


// get route
router.get("/entries", getEntriesProductReport);
router.get("/requisitions", getRequisitionReport);
router.get("/maintanances", getMaintananceReport);


module.exports = router;
