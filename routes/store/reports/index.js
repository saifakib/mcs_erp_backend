const router = require("express").Router();
const {
  entriesProductReport,
  productStockStatus,
  productLogs,
  requisitionLogs,
  userRequisitionLogs,
  viewUserReqReport,
} = require("../../../controllers/store/reports");

const { checkBoth } = require("../../../middlewares/checkAuthorization");
const { validateToken } = require("../../../utils/JWT");

// get route
router.get("/entries", checkBoth, entriesProductReport);
router.get("/stockStatus", checkBoth, productStockStatus);
router.get("/productlogs", checkBoth, productLogs);
router.get("/requisitions", checkBoth, requisitionLogs);
router.get("/user/requisitions", validateToken, userRequisitionLogs);
router.get("/user/:hrid/requisitions/:requestid", viewUserReqReport);

module.exports = router;
