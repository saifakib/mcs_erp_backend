const router = require("express").Router();
const { getCategories, getCategory, postCategory, putCategory, removeCategory, getProductLists, getProduct, postProductLists, putProductLists, removeProductLists, getModels, getModel, postModel, putModel, removeModel, getSpecifications, getSpecification, postSpecification, putSpecifications, removeSpecification, getUnits, getUnit, postUnit, putUnit, removeUnit, getBrands, getBrand, postBrand, putBrand, removeBrand } = require("../../../controllers/it/settings");
const { checkCategory, checkProductList, checkModel, checkSpecification, checkUnit, checkBrand } = require("../../../validator/it/settings");


router.route("/categories")
    .get(getCategories)
    .post(checkCategory, postCategory)
    .put(checkCategory, putCategory)
    .delete(checkCategory, removeCategory)
router.get("/categories/:category_id", getCategory);


router.route("/productlists")
    .get(getProductLists)
    .post(checkProductList, postProductLists)
    .put(checkProductList, putProductLists)
    .delete(checkProductList, removeProductLists)
router.get("/productlists/:product_id", getProduct);


router.route("/models")
    .get(getModels)
    .post(checkModel, postModel)
    .put(checkModel, putModel)
    .delete(checkModel, removeModel)
router.get("/models/:model_id", getModel);


router.route("/specifications")
    .get(getSpecifications)
    .post(checkSpecification, postSpecification)
    .put(checkSpecification, putSpecifications)
    .delete(checkSpecification, removeSpecification)
router.get("/specifications/:specification_id", getSpecification);


router.route("/units")
    .get(getUnits)
    .post(checkUnit, postUnit)
    .put(checkUnit, putUnit)
    .delete(checkUnit, removeUnit)
router.get("/units/:unit_id", getUnit);


router.route("/brands")
    .get(getBrands)
    .post(checkBrand, postBrand)
    .put(checkBrand, putBrand)
    .delete(checkBrand, removeBrand)
router.get("/brands/:brand_id", getBrand);



module.exports = router;