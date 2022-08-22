const router = require("express").Router();
const { checkProductDuplicate } = require('../../../controllers/store/product')


router.get('/checkProductDuplicate/:id', checkProductDuplicate)


module.exports = router;