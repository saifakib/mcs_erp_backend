const router = require("express").Router();
const { manageProducts, checkProductDuplicate, getProductlistByCategoryId, categoryProductsQuantitiesById, saveProductEntrilist } = require("../../../controllers/store/product");


router.get("/manageproducts", manageProducts)
router.get("/checkProductDuplicate/:prod_id", checkProductDuplicate);
router.get("/getCategoryProductlist/:cat_id", getProductlistByCategoryId);
router.get('categoryProductsQuantities/:cat_id', categoryProductsQuantitiesById)
router.post("/saveproductentrilist", saveProductEntrilist);
// router.post("/reupdateproductentrilist")

module.exports = router;
