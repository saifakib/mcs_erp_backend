const router = require("express").Router();
const { getLogActivity, postLogActivity } = require("../../../controllers/store/logActivity");
const { checkLogActivity } = require("../../../validator/store/logActivity");

const { validateToken } = require("../../../middlewares/JWT");

// post route
router.post("/", validateToken, checkLogActivity, postLogActivity);   // employee_id collect from token

// get route
router.get('/', validateToken, getLogActivity);


module.exports = router;
