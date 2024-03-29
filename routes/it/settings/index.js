const router = require("express").Router();
const { getCategories, getCategory, postCategory, putCategory, removeCategory, getProductLists, getProduct, postProductLists, putProductLists, removeProductLists, getModels, getModel, postModel, putModel, removeModel, getSpecifications, getSpecification, postSpecification, putSpecifications, removeSpecification, getSpecificationsByModelId, postModelSpecification, getUnits, getUnit, postUnit, putUnit, removeUnit, getBrands, getBrand, postBrand, putBrand, removeBrand, getSuppliers, getSupplier, postSupplier, putSupplier, removeSupplier, getProductListCountByCategories, getProductListByCategoryId } = require("../../../controllers/it/settings");
const { selectSpecificationsByModelId } = require("../../../services/it/settings");

const { checkCategory, checkProductList, checkModel, checkSpecification, checkModelSpecification, checkUnit, checkBrand, checkSupplier } = require("../../../validator/it/settings");


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
router.get("/productlist/categories", getProductListCountByCategories);
router.get("/productlist/categories/:category_id", getProductListByCategoryId);



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

router.post("/modelSpecifications", checkModelSpecification, postModelSpecification)
router.get("/modelSpecifications/:model_id", getSpecificationsByModelId)

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


router.route("/suppliers")
    .get(getSuppliers)
    .post(checkSupplier, postSupplier)
    .put(checkSupplier, putSupplier)
    .delete(checkSupplier, removeSupplier)
router.get("/suppliers/:supplier_id", getSupplier);


module.exports = router;