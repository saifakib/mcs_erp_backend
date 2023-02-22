const router = require("express").Router();
const {
    getEntriesProductReport, getRequisitionReport, getIndividualProdRequisitionHistory, getMaintananceReport, getSpecificationsByIndProdIdReport
} = require("../../../controllers/it/report");


// get route
router.get("/entries", getEntriesProductReport);
router.get("/requisitions", getRequisitionReport);
router.get("/requisitions/indProd", getIndividualProdRequisitionHistory);
router.get("/maintanances", getMaintananceReport);
router.get("/maintanance/indProd", getSpecificationsByIndProdIdReport);


module.exports = router;
