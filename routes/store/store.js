const router = require("express").Router();
const settings = require("../../controllers/store/settings/settings");

// get route
router.get("/settings/months", settings.getMonths);
router.get("/settings/categories", settings.getCategories);
router.get("/settings/units", settings.getUnits);
router.get("/settings/suppliers", settings.getSuppliers);
router.get("/settings/products", settings.getProducts);

// post routes
router.post("/settings/categories", settings.postCategory);
router.post("/settings/units", settings.postUnits);
router.post("/settings/suppliers", settings.postSupplier);
router.post("/settings/products", settings.postProduct);

// update routes
router.put("/settings/categories", settings.updateCategory);

module.exports = router;
