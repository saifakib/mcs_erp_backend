const router = require("express").Router();
const {
    getEntriesProductReport,
} = require("../../../controllers/it/report");


// get route
router.get("/entries", getEntriesProductReport);
router.get("/requisitions", getEntriesProductReport);


module.exports = router;
