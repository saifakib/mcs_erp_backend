const router = require("express").Router();
const { login, logout, getCurrentUser, getSingleUserWithVaidation } = require("../../controllers/auth");
//const { validateToken } = require("../../utils/JWT");
const { validateToken } = require("../../middlewares/JWT");

// get route
router.post("/login", login);
router.post("/logout", logout);
router.get("/getLoginUser", getCurrentUser);
router.post("/getSingleUser", validateToken, getSingleUserWithVaidation);

module.exports = router;
