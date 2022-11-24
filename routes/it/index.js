const router = require("express").Router();

const settingsRoute = require("./settings");


router.use("/settings", settingsRoute);


module.exports = router;