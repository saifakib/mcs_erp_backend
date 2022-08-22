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

module.exports = router;
