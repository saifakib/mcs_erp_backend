const router = require("express").Router();
const { manageProducts, checkProductDuplicate, getProductlistByCategoryId, categoryProductsQuantitiesById, saveProductEntrilist, getStoreProByCatId } = require("../../../controllers/store/product");


router.get("/manageproducts", manageProducts);
router.get('/getStoreProductByCategoryId/:cat_id', getStoreProByCatId);
router.get("/checkProductDuplicate/:prod_id", checkProductDuplicate);
router.get("/getCategoryProductlist/:cat_id", getProductlistByCategoryId);
router.get('categoryProductsQuantities/:cat_id', categoryProductsQuantitiesById)
router.post("/saveproductentrilist", saveProductEntrilist);
// router.post("/reupdateproductentrilist")

module.exports = router;
