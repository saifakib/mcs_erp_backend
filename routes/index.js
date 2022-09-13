const router = require("express").Router();
const storeRoutes = require("./store");
const hrRoutes = require("./hr")

router.use("/store", storeRoutes);
router.use("/hr", hrRoutes);


module.exports = router;
