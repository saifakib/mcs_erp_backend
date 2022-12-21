const router = require("express").Router();
const { getMaintanances, getMaintanance, postMaintanance, postServicing, putMaintanance, putServicing } = require("../../../controllers/it/maintanance");

router.route("/")
    .get(getMaintanances)
    .post(postMaintanance)
    .put(putMaintanance)
router.get("/:maintanance_id", getMaintanance);

router.route("/servicing")
    .post(postServicing)
    .put(putServicing)

module.exports = router;