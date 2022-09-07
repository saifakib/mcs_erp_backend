const router = require("express").Router();
const {  entriesProductReport, productStockStatus } = require("../../../controllers/store/reports")

// get route
router.get('/entries', entriesProductReport);
router.get('/stockStatus', productStockStatus)



module.exports = router;
