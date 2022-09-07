const router = require("express").Router();
const {  entriesProductReport } = require("../../../controllers/store/reports")

// get route
router.get('/entries', entriesProductReport);



module.exports = router;
