const router = require("express").Router();
const { manageProducts, checkProductDuplicate, getProductlistByCategoryId, categoryProductsQuantitiesById, saveProductEntrilist, getStoreProByCatId, getStoreProductByListId, updateproductentrilist, lastMrrNum, newProductList } = require("../../../controllers/store/product");


router.get("/manageproducts", manageProducts);
router.get('/getStoreProductByCategoryId/:cat_id', getStoreProByCatId);
router.get("/checkProductDuplicate/:prod_id", checkProductDuplicate);
router.get("/getCategoryProductlist/:cat_id", getProductlistByCategoryId);
router.get('categoryProductsQuantities/:cat_id', categoryProductsQuantitiesById)
router.post("/saveproductentrilist", saveProductEntrilist);
router.get('/getStoreProductByListId/:list_id', getStoreProductByListId),
router.get('/lastMrrNumber', lastMrrNum)
router.post("/updateproductentrilist", updateproductentrilist);
router.get('/newProductList/:cat_id', newProductList);

module.exports = router;
