const router = require("express").Router();
const { getCategories, getCategory, postCategory, putCategory, removeCategory, getProductLists, getProduct, postProductLists, putProductLists, removeProductLists, getModels, getModel, postModel, putModel, removeModel } = require("../../../controllers/it/settings");
const { checkCategory, checkProductList, checkModel } = require("../../../validator/it/settings");



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



module.exports = router;