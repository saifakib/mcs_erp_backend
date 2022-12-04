const router = require("express").Router();
const { newProductList, postProductEntrilist, putProductEntrilist } = require("../../../controllers/it/product");

const { checkProdEntries } = require("../../../validator/it/product")

router.get("/newProductList/:category_id", newProductList);

router.route("/strProdEntry")
    .post(checkProdEntries, postProductEntrilist)
    .put(checkProdEntries, putProductEntrilist)



module.exports = router;