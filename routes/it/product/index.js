const router = require("express").Router();
const { newProductList, postProductEntrilist, putProductEntrilist } = require("../../../controllers/it/product");

const { checkPostProdEntries } = require("../../../validator/it/product")

router.get("/newProductList/:category_id", newProductList);

router.route("/strProdEntry", checkPostProdEntries)
    .post(postProductEntrilist)
    .put(putProductEntrilist)





module.exports = router;