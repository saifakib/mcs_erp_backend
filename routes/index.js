const router = require("express").Router();
const store = require("./store/store");

router.use("/store", store);

module.exports = router;
