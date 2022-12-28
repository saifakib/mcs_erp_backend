const router = require("express").Router();
const { getMaintanances, getMaintanance, postMaintanance, postServicing, putMaintanance, putServicing } = require("../../../controllers/it/maintanance");

const { checkMaintanance, checkServicing } = require("../../../validator/it/maintanance")

router.route("/")
    .get(getMaintanances)
    .post(checkMaintanance, postMaintanance)
    .put(checkMaintanance, putMaintanance)
router.get("/:maintanance_id", getMaintanance);

router.route("/servicing")
    .post(checkServicing, postServicing)
    .put(checkServicing, putServicing)

module.exports = router;