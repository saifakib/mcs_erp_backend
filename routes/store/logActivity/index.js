const router = require("express").Router();
const { getLogActivity, postLogActivity } = require("../../../controllers/store/logActivity");
const { checkLogActivity } = require("../../../validator/store/logActivity");

const { validateToken } = require("../../../middlewares/JWT");

// post route
router.post("/", validateToken, checkLogActivity, postLogActivity);

// get route
router.get('/', getLogActivity);


module.exports = router;
