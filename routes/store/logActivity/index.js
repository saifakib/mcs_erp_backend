const router = require("express").Router();
const { postLogActivity } = require("../../../controllers/store/logActivity");
const { checkLogActivity } = require("../../../validator/store/logActivity")

// post route
router.post("/", checkLogActivity, postLogActivity);


module.exports = router;
