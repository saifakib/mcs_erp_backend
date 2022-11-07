const router = require("express").Router();
const { login, logout } = require("../../controllers/auth");
const { validateToken } = require("../../utils/JWT");

// get route
router.post("/login", login);
router.post("/logout", validateToken, logout);

module.exports = router;
