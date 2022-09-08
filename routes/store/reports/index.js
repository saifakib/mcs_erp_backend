const router = require("express").Router();
const {  entriesProductReport, productStockStatus, singleProductLogs } = require("../../../controllers/store/reports")

// get route
router.get('/entries', entriesProductReport);
router.get('/stockStatus', productStockStatus);
router.get('/singleproductlogs', singleProductLogs);



module.exports = router;
