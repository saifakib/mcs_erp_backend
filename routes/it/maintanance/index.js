const router = require("express").Router();
const { getMaintanances, postMaintanance, postServicing, putMaintanance, putServicing } = require("../../../controllers/it/maintanance");

router.route("/")
    .get(getMaintanances)
    .post(postMaintanance)
    .put(putMaintanance)

router.route("/servicing")
    .post(postServicing)
    .put(putServicing)

module.exports = router;