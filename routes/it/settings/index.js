const router = require("express").Router();
const { getCategories, getCategory, postCategory, putCategory, removeCategory } = require("../../../controllers/it/settings")
const { checkCategory } = require("../../../validator/it/settings")

router.route("/categories")
    .get(getCategories)
    .post(checkCategory, postCategory)
    .put(checkCategory, putCategory)
    .delete(checkCategory, removeCategory)
router.get("/categories/:category_id", getCategory);



module.exports = router;