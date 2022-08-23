const router = require("express").Router();
const settingsController = require("../../controllers/store/settings/settings");

// get route
router.get("/months", settingsController.getMonths);
router.get("/categories", settingsController.getCategories);
router.get("/units", settingsController.getUnits);
router.get("/suppliers", settingsController.getSuppliers);
router.get("/products", settingsController.getProducts);

// post routes
router.post("/categories", settingsController.postCategory);
router.post("/units", settingsController.postUnits);
router.post("/suppliers", settingsController.postSupplier);
router.post("/products", settingsController.postProduct);

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
