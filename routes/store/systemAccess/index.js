const router = require("express").Router();
const { getCategoryAllProdWAccess, getUserNotAccessProduct, postProdNotAccesstoUser, removeProdNotAccesstoUser } = require("../../../controllers/store/systemAccess");


// ----- Permission ----- //
router.get("/users/:empid/:catid", getCategoryAllProdWAccess);
router.get("/users/:empid", getUserNotAccessProduct);
router.post("/users", postProdNotAccesstoUser);
router.delete("/users", removeProdNotAccesstoUser);



module.exports = router;

