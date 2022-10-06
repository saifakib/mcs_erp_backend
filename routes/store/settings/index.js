const router = require("express").Router();
const settingsController = require("../../../controllers/store/settings/settings");
const { checkCatPostName, checkCatPostUnit, checkCatPostSupplier, checkCatPostProducts } = require("../../../validator/store/settings");


// get route
router.get("/months", settingsController.getMonths);
router.get("/categories", settingsController.getCategories);
router.get("/category/:id", settingsController.getSingleCategory);

router.get("/units", settingsController.getUnits);
router.get("/unit/:id", settingsController.getSingleUnit);

router.get("/suppliers", settingsController.getSuppliers);
router.get("/supplier/:id", settingsController.getSingleSupplier);

router.get("/products", settingsController.getProducts);
router.get("/product/:id", settingsController.getSingleProduct);

router.get("/categories-data", settingsController.getCategoryWithLength);
router.get("/productByCatId/:id", settingsController.getProductByCatId);

// post routes
router.post("/categories", settingsController.postCategory);
router.post("/units", checkCatPostUnit, settingsController.postUnits);
router.post("/suppliers", checkCatPostSupplier, settingsController.postSupplier);
router.post("/products", checkCatPostProducts, settingsController.postProduct);

// update routes
router.put("/categories", settingsController.updateCategory);
router.put("/units", settingsController.updateUnits);
router.put("/suppliers", settingsController.updateSupplier);
router.put("/products", settingsController.updateProducts);

// delete routes
router.delete("/categories", settingsController.deleteCategory);
router.delete("/units", settingsController.deleteUnits);
router.delete("/suppliers", settingsController.deleteSupplier);
router.delete("/products", settingsController.deleteProducts);

module.exports = router;
