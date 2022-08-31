const { createResponse } = require("../../../utils/responseGenerator");
const {
  getProducts,
  totalQuantites,
  totalQuantitesByCategoryId,
  getProducListById,
  getStoreProductByProdListId,
  getProducListByCategoryId,
  postProductEntries,
  postStoreProduct,
  postProductEntriesLists,
  postProductSummaries,
  getStoreProductByCategoryId,
  getTotalStoreProducts,
  getTotalStoreProdQty,
  getCategoryWithStoreLength,
  getExStoreProductByProdListId,
  updateStoreProduct,
  getLastMrrNumber,
  getNewProductList,
  testProduct
} = require("../../../services/store/product/index");
const { getSingleCategory, getSingleUnit } = require("../../../services/store/settings/index");
const { format } = require('date-fns')

/*------------- All Get Routes ---------------*/

const manageProducts = async (_, res, next) => {
  try {
    const categorirs = await getCategoryWithStoreLength();
    const { rows } = await getTotalStoreProdQty();

    let result = {
      categories: categorirs.rows,
      totalProducts: rows[0].PRODUCT,
      totalquantites: rows[0].QUENTITY,
    };

    res.json(createResponse(result));
  } catch (err) {
    console.log("Err", err)
    next(err);
  }
};

const getStoreProByCatId = async (req, res, next) => {
  const { cat_id: CAT_ID } = req.params;
  try {
    const result = await getStoreProductByCategoryId(CAT_ID);
    res.json(createResponse(result.rows));
  } catch (err) {
    next(err);
  }
}

const checkProductDuplicate = async (req, res, next) => {
  const { prod_id: PROD_ID } = req.params;
  try {
    const result1 = await getProducListById(PROD_ID);
    if (result1.rows.length > 0) {
      const result2 = await getStoreProductByProdListId(result1.rows[0].PRODID);
      console.log(result2)
      if (result2.rows.length > 0) {
        res.json(createResponse(true));
      } else {
        res.json(createResponse(false));
      }
    } else {
      res.json(createResponse(null, "Product Id does not exits"));
    }
  } catch (err) {
    next(err);
  }
};

const getProductlistByCategoryId = async (req, res, next) => {
  const { cat_id: CAT_ID } = req.params;
  try {
    const result = await getProducListByCategoryId(CAT_ID);
    if (result.rows.length > 0) {
      res.json(createResponse(result.rows));
    } else {
      res.json(createResponse(null, "Category Id does not exits"));
    }
  } catch (err) {
    next(err);
  }
};

const categoryProductsQuantitiesById = async (req, res, next) => {
  const { cat_id: CAT_ID } = req.params;
  try {
    const category = await getSingleCategory({ CAT_ID });
    const totalProductQuantites = await totalQuantitesByCategoryId(CAT_ID);

    let result = {
      category: category.rows,
      totalProductQuantites,
    };
    res.json(createResponse(result));

  } catch (err) {
    next(err);
  }
};


const lastMrrNum = async (req, res, next) => {
  try {
    let mrrNumber = await getLastMrrNumber();
    res.json(createResponse(mrrNumber.rows[0].MRRNO + 1));
  } catch (err) {
    next(err)
  }
}

const saveProductEntrilist = async (req, res, next) => {
  const { mrrnno, supplier, products, username } = req.body;
  let date = new Date();
  let entridate = date.toISOString().split('T')[0];
  let entritime = format(date, 'hh:mm a');
  let entrimonth = format(date, 'LLLL-yyyy');
  let summdate = format(date, 'yyyy-MM-dd');
  try {
    const postProEntries = await postProductEntries(req.body, entridate, entritime, entrimonth);

    if (postProEntries.outBinds.id[0]) {
      // product should be an object
      products.forEach(async (product) => {
        const postStorePro = await postStoreProduct(product);

        if (postStorePro.outBinds.id[0]) {
          const postProEnList = await postProductEntriesLists(product, mrrnno, supplier, postStorePro.outBinds.id[0], entridate, entrimonth, username);
          const postProSum = await postProductSummaries(product, postStorePro.outBinds.id[0], entridate, summdate, entrimonth);

          if (!postProEnList.outBinds.id[0] || !postProSum.outBinds.id[0]) {
            res.json(createResponse(null, "Error Occured In New Product Entry", true));
          }
        }
        else {
          res.json(createResponse(null, "Some Error Occured In New Product Entry", true));
        }
      }
      )
      res.json(createResponse(null, "Product Upload Succesfully"));
    }
    else {
      res.json(createResponse(null, "Error Occured In Product Entry !!", true));
    }
  }
  catch (err) {
    next(err);
  }
}

const getStoreProductByListId = async (req, res, next) => {
  const { list_id } = req.params;
  try {
    if (!list_id) {
      res.json(createResponse(null, "Parameter required", true));
    } else {
      let storeProduct = await getExStoreProductByProdListId(list_id);
      res.json(createResponse(storeProduct.rows[0]));
    }
  } catch (err) {
    next(err)
  }
}

const updateproductentrilist = async (req, res, next) => {
  const { mrrnno, supplier, products, username } = req.body;
  let date = new Date();
  let entridate = date.toISOString().split('T')[0];
  let entritime = format(date, 'hh:mm a');
  let entrimonth = format(date, 'LLLL-yyyy');
  let summdate = format(date, 'yyyy-MM-dd');
  try {
    const postProEntries = await postProductEntries(req.body, entridate, entritime, entrimonth);

    if (postProEntries.outBinds.id[0]) {
      // product should be an object
      products.forEach(async (product) => {
        if (product.proid) {
          await updateStoreProduct(product);
          const postProEnList = await postProductEntriesLists(product, mrrnno, supplier, postStorePro.outBinds.id[0], entridate, entrimonth, username);
          const postProSum = await postProductSummaries(product, postStorePro.outBinds.id[0], entridate, summdate, entrimonth);

          if (!postProEnList.outBinds.id[0] || !postProSum.outBinds.id[0]) {
            res.json(createResponse(null, "Error Occured In New Product Entry", true));
          }
        }
        else {
          res.json(createResponse(null, "Some Error Occured In New Product Update", true));
        }
      }
      )
      res.json(createResponse(null, "Product Update Succesfully"));
    }
    else {
      res.json(createResponse(null, "Error Occured In Product Entry !!", true));
    }
  }
  catch (err) {
    next(err);
  }
}


const newProductList = async(req, res, next) => {
  const { cat_id:CAT_ID } = req.params;

  try {
    const productListForNew = await getNewProductList(CAT_ID);
    res.json(createResponse(productListForNew.rows));
  } catch(err) {
    next(err)
  }
}

module.exports = {
  manageProducts,
  checkProductDuplicate,
  getProductlistByCategoryId,
  categoryProductsQuantitiesById,
  saveProductEntrilist,
  updateproductentrilist,
  getStoreProByCatId,
  getStoreProductByListId,
  lastMrrNum,
  newProductList
};