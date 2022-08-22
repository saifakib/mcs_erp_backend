const router = require("express").Router();
const { manageProducts, checkProductDuplicate, getCategoryProductlist } = require("../../../controllers/store/product");


router.get("/manageproducts", manageProducts)
router.get("/checkProductDuplicate/:id", checkProductDuplicate);
router.get("/getCategoryProductlist/:id", getCategoryProductlist);
router.get('categoryProducts/:id')
router.post("/saveproductentrilist");
router.post("/reupdateproductentrilist")

module.exports = router;
