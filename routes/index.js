const router = require("express").Router();
const storeRoutes = require("./store");

router.use("/store", storeRoutes);

module.exports = router;
