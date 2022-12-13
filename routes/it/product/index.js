const router = require("express").Router();
const { newProductList, getStoreProducts, getStoreProductsById, manageProducts, getStrProductsbyCategoryId, getStrProductsbyCatIdProdId,postProductEntrilist } = require("../../../controllers/it/product");

const { checkProdEntries, checkStrProdList } = require("../../../validator/it/product")

router.get("/newProductList/:category_id", newProductList);
router.route("/store")
    .get(getStoreProducts)
    // .put(checkStrProdList, putStoreProductById)
router.get("/store/:str_pro_id", getStoreProductsById);

router.get("/manage", manageProducts);
router.get("/manage/categories/:category_id", getStrProductsbyCategoryId)
router.get("/manage/categories/:category_id/:product_id", getStrProductsbyCatIdProdId)

router.route("/strProdEntry")
    .post(checkProdEntries, postProductEntrilist)
    // .put(checkProdEntries, putProductEntrilist)





module.exports = router;