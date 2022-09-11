const router = require("express").Router();
const {  entriesProductReport, productStockStatus, productLogs } = require("../../../controllers/store/reports")

// get route
router.get('/entries', entriesProductReport);
router.get('/stockStatus', productStockStatus);
router.get('/productlogs', productLogs);



module.exports = router;
