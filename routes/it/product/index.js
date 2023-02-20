const router = require("express").Router();
const { newProductList, getStoreProducts, getStoreProductsById, getStoreProdCountByProId, getIndStrProductsbyProId, getIndStrProductsbyStrId, manageProducts, getStrProductsbyCategoryId, getStrProductsbyCatIdProdId, getIndividualListByProId, getMaintananceProducts, postProductEntrilist, putIndProduct } = require("../../../controllers/it/product");

const { checkProdEntries, checkStrProdList, checkIndProdList } = require("../../../validator/it/product");

router.get("/newProductList/:category_id", newProductList);
router.route("/store")
    .get(getStoreProducts)
    // .put(checkStrProdList, putStoreProductById)
router.get("/store/:str_pro_id", getStoreProductsById);
router.get("/sind/:pro_id", getStoreProdCountByProId);

router.get("/manage", manageProducts);
router.get("/manage/categories/:category_id", getStrProductsbyCategoryId)
router.get("/manage/categories/:category_id/:product_id", getStrProductsbyCatIdProdId)

router.get("/manage/:supplier_id/:product_id", getIndStrProductsbyProId)
router.get("/manage/:supplier_id/:product_id/:str_pro_id", getIndStrProductsbyStrId)

router.put("/individual", checkIndProdList, putIndProduct)

router.route("/strProdEntry")
    .post(checkProdEntries, postProductEntrilist)
    // .put(checkProdEntries, putProductEntrilist)

router.get("/maintanance/products", getMaintananceProducts)
router.get("/maintanance/individuals/:pro_id", getIndividualListByProId)





module.exports = router;