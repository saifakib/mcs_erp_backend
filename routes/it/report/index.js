const router = require("express").Router();
const {
    getEntriesProductReport, getRequisitionReport
} = require("../../../controllers/it/report");


// get route
router.get("/entries", getEntriesProductReport);
router.get("/requisitions", getRequisitionReport);


module.exports = router;
