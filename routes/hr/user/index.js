const router = require("express").Router();
const userController = require("../../../controllers/hr/user");

// get route
router.put("/update-password", userController.updateUserPassword);
router.put(
  "/update-password/byAdmin",
  userController.updateUserPasswordByAdmin
);

module.exports = router;
