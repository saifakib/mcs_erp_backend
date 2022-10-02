const { createResponse } = require("../../../utils/responseGenerator");
const {
  getStoreProducts,
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
  updateStoreProductM,
  getTotalEntQuantites
} = require("../../../services/store/product/index");
const {
  getSingleCategory,
  getSingleUnit,
  updateProducts,
} = require("../../../services/store/settings/index");
const { format } = require("date-fns");

/*------------- All Get Controller ---------------*/

const manageProducts = async (_, res, next) => {
  try {
    const categorirs = await getCategoryWithStoreLength();
    const { rows: totalQuantites } = await getTotalEntQuantites();
    const { rows } = await getTotalStoreProdQty();

    let result = {
      categories: categorirs.rows,
      totalProducts: rows[0].PRODUCT,
      totalquantites: totalQuantites[0].TOTAL_QUANTITIES,
    };

    res.json(createResponse(result));
  } catch (err) {
    next(err);
  }
};

const lastMrrNum = async (_, res, next) => {
  try {
    let mrrNumber = await getLastMrrNumber();
    res.json(createResponse(mrrNumber.rows[0].MRRNO + 1));
  } catch (err) {
    next(err);
  }
};

const getStoreProByCatId = async (req, res, next) => {
  const { cat_id: CAT_ID } = req.params;
  const { search } = req.headers;
  const { page, limit } = req.query;
  try {
    const result = await getStoreProductByCategoryId(
      CAT_ID,
      search,
      page,
      limit
    );
    res.json(createResponse(result.rows));
  } catch (err) {
    next(err);
  }
};

const checkProductDuplicate = async (req, res, next) => {
  const { prod_id: PROD_ID } = req.params;
  try {
    if (!PROD_ID) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const result1 = await getProducListById(PROD_ID);
      if (result1.rows.length > 0) {
        const result2 = await getStoreProductByProdListId(
          result1.rows[0].PRODID
        );
        if (result2.rows.length > 0) {
          res.json(createResponse(true));
        } else {
          res.json(createResponse(false));
        }
      } else {
        res.json(createResponse(null, "Product Id does not exits"));
      }
    }
  } catch (err) {
    next(err);
  }
};

const getProductlistByCategoryId = async (req, res, next) => {
  const { cat_id: CAT_ID } = req.params;

  try {
    if (!CAT_ID) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const result = await getProducListByCategoryId(CAT_ID);
      if (result.rows.length > 0) {
        res.json(createResponse(result.rows));
      } else {
        res.json(createResponse(null, "Category Id does not exits"));
      }
    }
  } catch (err) {
    next(err);
  }
};

const categoryProductsQuantitiesById = async (req, res, next) => {
  const { cat_id: CAT_ID } = req.params;

  try {
    if (!CAT_ID) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const response = await totalQuantitesByCategoryId(CAT_ID);

      res.json(createResponse(response.rows));
    }
  } catch (err) {
    next(err);
  }
};

const newProductList = async (req, res, next) => {
  const { cat_id: CAT_ID } = req.params;

  try {
    if (!CAT_ID) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const productListForNew = await getNewProductList(CAT_ID);
      res.json(createResponse(productListForNew.rows));
    }
  } catch (err) {
    next(err);
  }
};

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
    next(err);
  }
};

const getStockProducts = async (req, res, next) => {
  try {
    const { search } = req.headers;
    const { page, limit } = req.query;

    if (!search) {
      res.json(createResponse(null, "Required headers needed", true));
    } else {
      const result = await getStoreProducts(search, page, limit);
      res.json(createResponse(result.rows));
    }
  } catch (err) {
    next(err.message);
  }
};

/*------------- End Get Controller ---------------*/

/*------------- All Post Controller ---------------*/

const saveProductEntrilist = async (req, res, next) => {
  const {
    mrrnno,
    supplier,
    products,
    username,
    suppdate,
    workorder,
    workodate,
    cashmemono,
    cashmemodate,
  } = req.body;

  let date = new Date();
  let entridate = date.toISOString().split("T")[0];
  let entritime = format(date, "hh:mm a");
  let entrimonth = format(date, "LLLL-yyyy");
  let summdate = format(date, "yyyy-MM-dd");

  try {
    if (
      !mrrnno ||
      !supplier ||
      !products ||
      !username ||
      !suppdate ||
      !workorder ||
      !workodate ||
      !cashmemono ||
      !cashmemodate
    ) {
      res.json(createResponse(null, "Missing Body Required!!", true));
    } else {
      const postProEntries = await postProductEntries(
        req.body,
        entridate,
        entritime,
        entrimonth
      );
      if (postProEntries.outBinds.id[0]) {
        // product should be an object
        products.forEach(async (product) => {
          const {
            proname,
            pro_name_two,
            prod_list_id,
            qty,
            price,
            category,
            prod_unit,
            stock_alert,
          } = product;
          if (
            !proname ||
            !pro_name_two ||
            !prod_list_id ||
            !qty ||
            !price ||
            !category ||
            !prod_unit ||
            !stock_alert
          ) {
            res.json(
              createResponse(null, "Missing Product Body Required!!", true)
            );
          } else {
            const postStorePro = await postStoreProduct(product);

            if (postStorePro.outBinds.id[0]) {
              const postProEnList = await postProductEntriesLists(
                product,
                mrrnno,
                supplier,
                postStorePro.outBinds.id[0],
                entridate,
                entrimonth,
                username
              );
              const postProSum = await postProductSummaries(
                product,
                postStorePro.outBinds.id[0],
                summdate,
                entrimonth
              );

              if (!postProEnList.outBinds.id[0] || !postProSum.outBinds.id[0]) {
                res.json(
                  createResponse(
                    null,
                    "Error Occured In New Product Entry",
                    true
                  )
                );
              }
            } else {
              res.json(
                createResponse(
                  null,
                  "Some Error Occured In New Product Entry",
                  true
                )
              );
            }
          }
        });
        res.json(createResponse(null, "Product Upload Succesfully"));
      } else {
        res.json(
          createResponse(null, "Error Occured In Product Entry !!", true)
        );
      }
    }
  } catch (err) {
    next(err);
  }
};

/*------------- End Post Controller ---------------*/

/*-------------  Update Controller ---------------*/
const updateproductentrilist = async (req, res, next) => {
  const {
    mrrnno,
    supplier,
    products,
    username,
    suppdate,
    workorder,
    workodate,
    cashmemono,
    cashmemodate,
  } = req.body;

  let date = new Date();
  let entridate = date.toISOString().split("T")[0];
  let entritime = format(date, "hh:mm a");
  let entrimonth = format(date, "LLLL-yyyy");
  let summdate = format(date, "yyyy-MM-dd");

  try {
    if (
      !mrrnno ||
      !supplier ||
      products.length === 0 ||
      !username ||
      !suppdate ||
      !workorder ||
      !workodate ||
      !cashmemono ||
      !cashmemodate
    ) {
      res.json(createResponse(null, "Missing Body Required!!", true));
    } else {
      const postProEntries = await postProductEntries(
        req.body,
        entridate,
        entritime,
        entrimonth
      );
      if (postProEntries.outBinds.id[0]) {
        // product should be an object
        products.forEach(async (product) => {
          if (product.proid) {
            let { proname, pro_name_two, qty, price, category, prod_unit } =
              product;
            if (
              !proname ||
              !pro_name_two ||
              !qty ||
              !price ||
              !category ||
              !prod_unit
            ) {
              res.json(
                createResponse(null, "Missing Product Body Required!!", true)
              );
            } else {
              await updateStoreProduct(product);
              const postProEnList = await postProductEntriesLists(
                product,
                mrrnno,
                supplier,
                product.proid,
                entridate,
                entrimonth,
                username
              );
              const postProSum = await postProductSummaries(
                product,
                product.proid,
                entridate,
                summdate,
                entrimonth
              );
              if (!postProEnList.outBinds.id[0] || !postProSum.outBinds.id[0]) {
                res.json(
                  createResponse(
                    null,
                    "Error Occured In New Product Entry",
                    true
                  )
                );
              }
            }
          } else {
            res.json(
              createResponse(
                null,
                "Some Error Occured In New Product Update",
                true
              )
            );
          }
        });
        res.json(createResponse(null, "Product Update Succesfully"));
      } else {
        res.json(
          createResponse(null, "Error Occured In Product Entry !!", true)
        );
      }
    }
  } catch (err) {
    next(err);
  }
};

const updateProductList = async (req, res, next) => {
  const {
    proid,
    prod_list_id,
    proname,
    pro_name_two,
    procate,
    prounit,
    stockalert,
    status,
  } = req.body;
  try {
    if (
      !proid ||
      !prod_list_id ||
      !proname ||
      !pro_name_two ||
      !procate ||
      !prounit
    ) {
      res.json(createResponse(null, "Missing Body Required!!", true));
    } else {
      const updateStrProM = await updateStoreProductM(
        proid,
        proname,
        pro_name_two,
        procate,
        prounit,
        stockalert,
        status
      );
      const updateListPro = await updateProducts({
        PRONAME: proname,
        PRONAMETWO: pro_name_two,
        PROCATE: procate,
        PRODID: prod_list_id,
      });

      if (updateStrProM.rowsAffected == 0 || updateListPro.rowsAffected == 0) {
        res.json(
          createResponse(
            null,
            "Something Error Occured in Product Update",
            true
          )
        );
      } else {
        res.json(createResponse(null, "Product Update Succesfully"));
      }
    }
  } catch (err) {
    next(err);
  }
};

/*------------- End Update Controller ---------------*/

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
  newProductList,
  updateProductList,
  getStockProducts,
};
