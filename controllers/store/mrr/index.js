const { createResponse } = require("../../../utils/responseGenerator");
const { format } = require("date-fns");
const {
  getSupplierWithProductEntriesInfo,
  getRecentMonthSupply,
  getMrrProListBySupplierId,
  getProductEntiresFirst,
  getProductEntriLists,
  getProductEntriListsFirst,
  updateProductEntriListById,
  updateStoreProductById,
  insertMrrLogs,
  findProductEntriListById,
  deleteProductEntriListById,
  insertMrrLogsWithRemarks,
  getSingleProEntriesByMrrno,
  updateSingleProEntriesByMrrno,
  updateProductEntriListsSupplier,
  getProductEntiresFirsts,
  getProductEntriListss,
  getCurrentStock,
  getProListById,
} = require("../../../services/store/mrr");
const { getSingleSupplier } = require("../../../services/store/settings");

/*------------------------------------- All Get Controller ------------------------------------*/

/**
 * Manage Supplier Conrtoller
 * @headers search
 * @query page
 * @query limit
 */

const manageSupplier = async (req, res, next) => {
  const date = new Date();
  let month = format(date, "LLLL-yyyy");
  const { search = "%%", searchr = "%%" } = req.headers;
  const { page, limit } = req.query;
  try {
    const suppliersWithEntriesInfo = await getSupplierWithProductEntriesInfo(
      search,
      page,
      limit
    );
    const recentMonthSupply = await getRecentMonthSupply(
      month,
      searchr,
      page,
      limit
    );
    const response = {
      suppliersWithEntriesInfo: suppliersWithEntriesInfo.rows,
      recentMonthSupply: recentMonthSupply.rows,
    };

    res.json(createResponse(response));
  } catch (err) {
    next(err);
  }
};

/**
 * Get Product List By Supplier Id
 * @param {Number} sup_id
 */
const mrrProListBySupId = async (req, res, next) => {
  const { sup_id: SUP_ID } = req.params;
  try {
    if (!SUP_ID) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      let response = await getMrrProListBySupplierId(SUP_ID);

      let result = {};

      if (response.rows.length > 0) {
        result = response.rows.reduce((acc, val) => {
          let obj = {
            SUP_ID: val.SUP_ID,
            MRRNUMBER: val.MRRNUMBER,
            PRODATE: val.PRODATE,
          };
          if (acc[val.PRODATE]) {
            acc[val.PRODATE].push(obj);
          } else {
            acc[val.PRODATE] = [];
            acc[val.PRODATE].push(obj);
          }
          return acc;
        }, {});
      }

      let result2 = Object.keys(result).reduce((acc, key) => {
        let createObj = {
          PRODATE: key,
          MRR: result[key],
        };
        acc.push({ ...createObj });
        return acc;
      }, []);

      res.json(createResponse(result2));
    }
  } catch (err) {
    next(err);
  }
};

/**
 * All Product Lists With Supplier Info
 * @param {Number} sup_id
 * @param {String} date
 */
const viewProductReceptBySupIdDate = async (req, res, next) => {
  const { sup_id: SUP_ID, date: date } = req.params;

  try {
    if (!SUP_ID || !date) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const suppliers = await getSingleSupplier({ SUP_ID });
      const entriesInfo = await getProductEntiresFirst(SUP_ID, date);
      const entriLists = await getProductEntriLists(SUP_ID, date);

      let response = {
        suppliers: suppliers.rows,
        entriesInfo: entriesInfo.rows,
        entriLists: entriLists.rows,
      };

      res.json(createResponse(response));
    }
  } catch (err) {
    next(err);
  }
};

/**
 * All Product Lists With Supplier Info with mrrno
 * @param {Number} sup_id
 * @param {String} date
 */
const viewProductReceptBySupIdMrrDate = async (req, res, next) => {
  const { sup_id: SUP_ID, mrrno: MRRNO, date: date } = req.params;

  try {
    if (!SUP_ID || !date || !MRRNO) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const suppliers = await getSingleSupplier({ SUP_ID });
      const entriesInfo = await getProductEntiresFirsts(SUP_ID, MRRNO, date);
      const entriLists = await getProductEntriListss(SUP_ID, MRRNO, date);

      const total = entriLists.rows.reduce(
        (acc, obj) => {
          (acc[0] += obj.QUANTITIES),
            (acc[1] += obj.QUANTITIES * obj.PROAMOUNT);
          return acc;
        },
        [0, 0]
      );

      let entriesInfoEd = {
        ...entriesInfo.rows[0],
        SUPPDATE: format(
          new Date(
            entriesInfo.rows[0].SUPPDATE.replace(
              /(\d{2})-(\d{2})-(\d{4})/,
              "$2/$1/$3"
            )
          ),
          "yyyy-MM-dd"
        ),
        WORKODATE: format(
          new Date(
            entriesInfo.rows[0].WORKODATE.replace(
              /(\d{2})-(\d{2})-(\d{4})/,
              "$2/$1/$3"
            )
          ),
          "yyyy-MM-dd"
        ),
        CASHMEMODATE: format(
          new Date(
            entriesInfo.rows[0].CASHMEMODATE.replace(
              /(\d{2})-(\d{2})-(\d{4})/,
              "$2/$1/$3"
            )
          ),
          "yyyy-MM-dd"
        ),
      };

      let response = {
        suppliers: suppliers.rows[0],
        entriesInfo: entriesInfoEd,
        entriLists: entriLists.rows,
        totalQuantities: total[0],
        totalProAmount: total[1],
      };

      res.json(createResponse(response));
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Last Product EntryList By Product ListId
 * @param {Number} list_id
 */
const lastEntryListByProListId = async (req, res, next) => {
  const { list_id: LIST_ID } = req.params;

  try {
    if (!LIST_ID) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const response = await getProductEntriListsFirst(LIST_ID);
      res.json(createResponse(response.rows));
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Get Product Entries Info By Mrr Number
 * @param {Number} mrrno
 */
const singleProductEntriesBymrrno = async (req, res, next) => {
  const { mrrno } = req.params;
  try {
    if (!mrrno) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const productEntriesInfo = await getSingleProEntriesByMrrno(mrrno);
      res.json(createResponse(productEntriesInfo.rows));
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Add More Mrr
 * All Product Lists With Supplier Info for Add Product In MRR
 * @param {Number} sup_id
 * @param {String} date
 */
const addMoreMrr = async (req, res, next) => {
  const { sup_id: SUP_ID, date: date } = req.params;

  try {
    if (!SUP_ID || !date) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const suppliers = await getSingleSupplier({ SUP_ID });
      const entriesInfo = await getProductEntiresFirst(SUP_ID, date);

      let response = {
        suppliers: suppliers.rows,
        entriesInfo: entriesInfo.rows,
      };

      res.json(createResponse(response));
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single entry product info
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getSingleEntry = async (req, res, next) => {
  const { proid, prolistid } = req.params;
  console.log(req.params);
  try {
    if (!proid || !prolistid) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const currentStock = await getCurrentStock({ proid });
      const proList = await getProListById({ prolistid });

      const object = {
        ...currentStock.rows[0],
        ...proList.rows[0],
      };

      let response = {
        mrrSingleGet: object,
      };

      res.json(createResponse(response));
    }
  } catch (err) {
    next(err);
  }
};

/*-------------------------------------- End Get Controller ----------------------------------------*/

/*------------------------------------- All PUT Controller -----------------------------------------*/

/**
 * Update Single Product Entrilist
 */
const updateSingleProductEntriList = async (req, res, next) => {
  const {
    prolistid,
    proid,
    proqty,
    oldquantity,
    oldamount,
    change_status,
    newquantity,
    newamount,
    username,
  } = req.body;
  let date = new Date();
  let entritime = format(date, "hh:mm a");
  let entridate = format(date, "yyyy-MM-dd");

  try {
    if (
      !prolistid ||
      !proid ||
      !oldquantity ||
      !oldamount ||
      !change_status ||
      !username
    ) {
      res.json(createResponse(null, "Required Body Missing", true));
    } else {
      let [changproqty, changequantity, changeamount] = [0, 0, 0];

      if (change_status == "plus") {
        if (!newquantity) {
          res.json(
            createResponse(null, "Required Body Missing - New Quantity", true)
          );
        } else {
          changproqty = Number(proqty) + Number(newquantity);
          changequantity = Number(oldquantity) + Number(newquantity);
          changeamount = Number(newamount);
        }
      } else if (change_status == "minus") {
        if (!newquantity) {
          res.json(
            createResponse(null, "Required Body Missing - New Quantity", true)
          );
        } else {
          changproqty = Number(proqty) - Number(newquantity);
          changequantity = Number(oldquantity) - Number(newquantity);
          changeamount = Number(newamount);
        }
      } else {
        if (!newamount) {
          res.json(
            createResponse(null, "Required Body Missing - New Amount", true)
          );
        } else {
          changequantity = Number(oldquantity);
          changeamount = Number(newamount);
          changproqty = Number(proqty);
        }
      }

      const updateProEntListById = await updateProductEntriListById(
        prolistid,
        changequantity,
        changeamount
      );
      const updateStoreProdById = await updateStoreProductById(
        proid,
        changproqty
      );
      const newMrrLog = await insertMrrLogs(
        proid,
        "Edit",
        oldquantity,
        oldamount,
        changequantity,
        changeamount,
        `'${entridate}, ${entritime}'`,
        username
      );

      console.log(updateProEntListById, updateStoreProdById, newMrrLog);

      if (
        updateProEntListById.rowsAffected == 0 ||
        updateStoreProdById.rowsAffected == 0 ||
        newMrrLog.rowsAffected == 0
      ) {
        res.json(
          createResponse(
            null,
            "Something Error Occured in Product Entry Update",
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

/**
 * Update Single Product Entries and Entrilist
 */
const updateProductEntriesBymrrno = async (req, res, next) => {
  const {
    mrrno,
    supplier,
    suppdate,
    workorder,
    workodate,
    cashmemono,
    cashmemodate,
  } = req.body;

  try {
    console.log(req.body);
    if (
      !mrrno ||
      !supplier ||
      !suppdate ||
      !workorder ||
      !workodate ||
      !cashmemono ||
      !cashmemodate
    ) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      await updateSingleProEntriesByMrrno(
        mrrno,
        supplier,
        suppdate,
        workorder,
        workodate,
        cashmemono,
        cashmemodate
      );
      await updateProductEntriListsSupplier(mrrno, supplier);

      // if (
      //   productEntriesInfo.rowsAffected ||
      //   changeSupplierEntriLists.rowsAffected
      // ) {
      //   res.json(
      //     createResponse(
      //       null,
      //       "Something Error Occured in Updateing Product",
      //       true
      //     )
      //   );
      // } else {
      //   res.json(createResponse(null, "Product Update Succesfully"));
      // }

      res.json(createResponse(null, "Product Update Succesfully"));
    }
  } catch (err) {
    next(err);
  }
};

/*------------------------------------- End PUT Controller ----------------------------------------*/

/*------------------------------------- All DELETE Controller ----------------------------------------*/

const deleteSingleProductEntriList = async (req, res, next) => {
  const { prolistid, proid, proqty, quantity, proamount, username } = req.body;
  let date = new Date();
  let entritime = format(date, "hh:mm a");
  let entridate = format(date, "yyyy-MM-dd");
  try {
    console.log(req.body);
    if (!prolistid || !proid || !proamount) {
      res.json(createResponse(null, "Required Body Missing", true));
    } else {
      const isFind = await findProductEntriListById(prolistid);
      if (isFind.rows.length == 0) {
        res.json(createResponse(null, "Id didn't find in database", true));
      } else {
        const deleteProdEntList = await deleteProductEntriListById(prolistid);
        const updateStoreProdById = await updateStoreProductById(
          proid,
          quantity
        );
        `'${entridate}, ${entritime}'`;
        const newMrrLog = await insertMrrLogsWithRemarks(
          proid,
          "Delete",
          `'Previous Stock was ${Number(proqty)} and MRR Stock was ${Number(
            quantity
          )}'`,
          proqty,
          proamount,
          quantity,
          proamount,
          `'${entridate}, ${entritime}'`,
          username
        );

        if (
          !deleteProdEntList ||
          updateStoreProdById.rowsAffected == 0 ||
          newMrrLog.rowsAffected == 0
        ) {
          res.json(
            createResponse(
              null,
              "Something Error Occured in Product Entry Delete",
              true
            )
          );
        } else {
          res.json(createResponse(null, "Product Delete Succesfully"));
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

/*------------------------------------- End DELETE Controller ----------------------------------------*/

module.exports = {
  manageSupplier,
  mrrProListBySupId,
  viewProductReceptBySupIdDate,
  viewProductReceptBySupIdMrrDate,
  lastEntryListByProListId,
  updateSingleProductEntriList,
  deleteSingleProductEntriList,
  singleProductEntriesBymrrno,
  updateProductEntriesBymrrno,
  addMoreMrr,
  getSingleEntry,
};
