const router = require("express").Router();
const {
    getEntriesProductReport,
} = require("../../../controllers/it/report");


// get route
router.get("/entries", getEntriesProductReport);

module.exports = router;
