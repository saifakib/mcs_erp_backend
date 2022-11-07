const router = require("express").Router();
const userController = require("../../../controllers/hr/user");

// get route
router.get("/update-password", userController.updateUserPassword);
router.get(
  "/update-password/byAdmin",
  userController.updateUserPasswordByAdmin
);

module.exports = router;
