const router = require("express").Router();
const { postProductEntrilist } = require("../../../controllers/it/product");

const { checkPostProdEntries } = require("../../../validator/it/product")

router.post("/strProdEntry", checkPostProdEntries, postProductEntrilist)




module.exports = router;