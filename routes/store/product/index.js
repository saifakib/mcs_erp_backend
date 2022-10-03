const router = require("express").Router();
const {
  manageProducts,
  checkProductDuplicate,
  getProductlistByCategoryId,
  categoryProductsQuantitiesById,
  saveProductEntrilist,
  getStoreProByCatId,
  getStoreProductByListId,
  updateproductentrilist,
  lastMrrNum,
  newProductList,
  updateProductList,
  getStockProducts,
} = require("../../../controllers/store/product");

const { requireRole } = require("../../../middlewares/store/role")

// Get Routes
router.get("/manageproducts", manageProducts);
router.get("/storeProducts", getStockProducts);

router.get("/getStoreProductByCategoryId/:cat_id", getStoreProByCatId);
router.get("/checkProductDuplicate/:prod_id", checkProductDuplicate);
router.get("/getCategoryProductlist/:cat_id", getProductlistByCategoryId);
router.get(
  "categoryProductsQuantities/:cat_id",
  categoryProductsQuantitiesById
);
router.get("/getStoreProductByListId/:list_id", getStoreProductByListId),
  router.get("/newProductList/:cat_id", newProductList);

router.get("/lastMrrNumber", requireRole, lastMrrNum);

// Post Routes
router.post("/productEntriesList", saveProductEntrilist);

// Update Routes
router.put("/productEntriesList", updateproductentrilist);
router.put("/updateProductList", updateProductList);

module.exports = router;
