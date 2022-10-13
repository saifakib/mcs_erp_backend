const router = require("express").Router();
const storeRoutes = require("./store");
const hrRoutes = require("./hr");

const { manageProducts } = require("./../controllers/store/product");

router.get("/test", manageProducts);

router.use("/store", storeRoutes);
router.use("/hr", hrRoutes);

module.exports = router;
