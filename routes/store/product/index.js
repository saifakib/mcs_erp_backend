const router = require("express").Router();
const {
  manageProducts,
  checkProductDuplicate,
  getProductlistByCategoryId,
  categoryProductsQuantitiesById,
  getStorProductByListId,
  saveProductEntrilist,
  getStoreProByCatId,
  getStoreProductByListId,
  updateproductentrilist,
  lastMrrNum,
  newProductList,
  updateProductList,
  getStockProducts,
  getStockProductsFR
} = require("../../../controllers/store/product");

const { checkBoth } = require('../../../middlewares/checkStoreAuthorization')

// Get Routes
router.get("/manageproducts", checkBoth, manageProducts);
router.get("/storeProducts", getStockProducts);
router.get("/storeProductsFR/:empid", getStockProductsFR);
router.get("/storeProducts/:list_id", getStorProductByListId);

router.get("/getStoreProductByCategoryId/:cat_id", checkBoth, getStoreProByCatId);
router.get("/checkProductDuplicate/:prod_id", checkBoth, checkProductDuplicate);
router.get("/getCategoryProductlist/:cat_id", checkBoth, getProductlistByCategoryId);
router.get(
  "categoryProductsQuantities/:cat_id",
  checkBoth,
  categoryProductsQuantitiesById
);
router.get("/getStoreProductByListId/:list_id", checkBoth, getStoreProductByListId),
  router.get("/newProductList/:cat_id", checkBoth, newProductList);

router.get("/lastMrrNumber", checkBoth, lastMrrNum);

// Post Routes
router.post("/productEntriesList", checkBoth, saveProductEntrilist);

// Update Routes
router.put("/productEntriesList", checkBoth, updateproductentrilist);
router.put("/updateProductList", checkBoth, updateProductList);

module.exports = router;
