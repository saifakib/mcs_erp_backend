const router = require("express").Router();
const { getCategoryAllProdWAccess, getUserAccessProduct, postProdAccesstoUser, removeProdAccesstoUser } = require("../../../controllers/store/systemAccess");


// ----- Permission ----- //
router.get("/users/:empid/:catid", getCategoryAllProdWAccess);
router.get("/users/:empid", getUserAccessProduct);
router.post("/users", postProdAccesstoUser);
router.delete("/users", removeProdAccesstoUser);



module.exports = router;

