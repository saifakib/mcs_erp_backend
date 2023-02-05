const router = require("express").Router();
const { getUserAccessProduct, postProdAccesstoUser, removeProdAccesstoUser } = require("../../../controllers/store/systemAccess");


// ----- Permission ----- //
//router.get();
router.post("/users", postProdAccesstoUser);
router.delete("/users", removeProdAccesstoUser);
router.get("/users/:empid", getUserAccessProduct);


module.exports = router;

