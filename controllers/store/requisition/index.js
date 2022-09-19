const { createResponse } = require("../../../utils/responseGenerator");
const {
  postRequisitionInfo,
  postReqProduct,
  getLastReqNo,
  updateRequisitionInfo,
  updateReqProducts,
  getRequisitionById,
  lastProRequiId,
  getRequisitionDetailsById,
  getReqInfo,
  getProductBalance,
  updateStoreProducts,
  updateBalance,
  insertSummeries,
  manualPostRequisitionInfo,
  postProRequisition,
  postProductSummaries,
  updateStoreProduct,
  pendingRequisitions,
  pendingRequisitionDetails,
  getLastReqInfo,
  doneRequisitions,
  doneRequisitionsDetails,
  approvedRequisitions,
  currentStock,
  userInfo,
  approvedRequisitionDetails,
  adminApproved,
} = require("../../../services/store/requisitions");
const { format } = require("date-fns");

/*------------- get ------------*/
module.exports.getRequisitionById = async (req, res, next) => {
  try {
    const { search } = req.headers;
    const { page, limit } = req.query;
    const { id } = req.params;
    if (!id) {
      res.json(createResponse(null, "User id missing", true));
    }
    if (!search || !page || !limit) {
      res.json(createResponse(null, "Parameter missing", true));
    }
    const { rows } = await getRequisitionById(id, search, page, limit);
    res.json(createResponse(rows));
  } catch (error) {
    next(error.message);
  }
};

module.exports.getRequisitionDetailsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.json(createResponse(null, "Employee id missing", true));
    }
    const { rows: data } = await getRequisitionDetailsById(id);
    const { rows: info } = await getReqInfo(id);
    res.json(createResponse({ info: info[0], products: data }));
  } catch (error) {
    next(err.message);
  }
};

// pending requisition
module.exports.pendingRequisitions = async (req, res, next) => {
  try {
    const { search } = req.headers;
    const { page, limit } = req.query;

    if (!search) {
      res.json(createResponse(null, "Search parameter missing", true));
    }
    if (!page || !limit) {
      res.json(createResponse(null, "Parameter missing", true));
    }
    const { rows } = await pendingRequisitions(search, page, limit);
    res.json(createResponse(rows));
  } catch (error) {
    next(error.message);
  }
};

// pending requisition details
module.exports.pendingRequisitionDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.json(createResponse(null, "Requisition id missing", true));
    }
    const { rows: details } = await pendingRequisitionDetails(id);

    // requisitionar info
    const { rows: info } = await userInfo(id, 0);
    let reqInfo = info[0];

    // requisition details
    const detailProducts = await Promise.all(
      details.map(async (item) => {
        const { rows: data } = await getLastReqInfo(item);
        const lastData = data.find((d) => d.PRODATE !== item.PRODATE);

        let obj;

        if (lastData.PROID === item.PROID) {
          obj = {
            PRODUCT_NAME: item.PRODUCT_NAME,
            PROREQUQTY: item.PROREQUQTY,
            PROID: item.PROID,
            LAST_DATE: lastData.PRODATE,
            LAST_QTY: lastData.PROREQUQTY,
          };
        } else {
          obj = {
            PRODUCT_NAME: item.PRODUCT_NAME,
            PROREQUQTY: item.PROREQUQTY,
            PROID: item.PROID,
            LAST_DATE: null,
            LAST_QTY: 0,
          };
        }

        return obj;
      })
    );

    // curren stock information
    const stockInfo = await Promise.all(
      details.map(async (item) => {
        const { rows: data } = await currentStock(item.PROID);
        const modified = data[0];
        return modified;
      })
    );

    res.json(
      createResponse({ reqInfo, stockInfo, productsInfo: detailProducts })
    );
  } catch (error) {
    next(error.message);
  }
};

// approved requisition
module.exports.approvedRequisitions = async (req, res, next) => {
  try {
    const { search } = req.headers;
    const { page, limit } = req.query;

    if (!search) {
      res.json(createResponse(null, "Search parameter missing", true));
    }
    if (!page || !limit) {
      res.json(createResponse(null, "Parameter missing", true));
    }
    const { rows } = await approvedRequisitions(search, page, limit);
    res.json(createResponse(rows));
  } catch (error) {
    next(error.message);
  }
};

// pending requisition details
module.exports.approvedRequisitionDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.json(createResponse(null, "Requisition id missing", true));
    }
    const { rows: details } = await approvedRequisitionDetails(id);

    // requisitionar info
    const { rows: info } = await userInfo(id, 1);
    let reqInfo = info[0];

    // requisition details
    const detailProducts = await Promise.all(
      details.map(async (item) => {
        const { rows: data } = await getLastReqInfo(item);
        const lastData = data.find((d) => d.PRODATE !== item.PRODATE);

        let obj;

        if (lastData.PROID === item.PROID) {
          obj = {
            PRODUCT_NAME: item.PRODUCT_NAME,
            PROREQUQTY: item.PROREQUQTY,
            PROID: item.PROID,
            LAST_DATE: lastData.PRODATE,
            LAST_QTY: lastData.PROREQUQTY,
          };
        } else {
          obj = {
            PRODUCT_NAME: item.PRODUCT_NAME,
            PROREQUQTY: item.PROREQUQTY,
            PROID: item.PROID,
            LAST_DATE: null,
            LAST_QTY: 0,
          };
        }

        return obj;
      })
    );

    // curren stock information
    const stockInfo = await Promise.all(
      details.map(async (item) => {
        const { rows: data } = await currentStock(item.PROID);
        const modified = data[0];
        return modified;
      })
    );

    // admin approved info
    const adminInfo = await Promise.all(
      details.map(async (item) => {
        const { rows: data } = await adminApproved(item);
        const modified = data[0];
        return modified;
      })
    );

    res.json(
      createResponse({
        reqInfo,
        productsInfo: detailProducts,
        adminApproved: adminInfo,
        stockInfo,
      })
    );
  } catch (error) {
    next(error.message);
  }
};

// done requisition
module.exports.doneRequisitions = async (req, res, next) => {
  try {
    const { search } = req.headers;
    const { page, limit } = req.query;

    if (!search) {
      res.json(createResponse(null, "Search parameter missing", true));
    }
    if (!page || !limit) {
      res.json(createResponse(null, "Parameter missing", true));
    }
    const { rows } = await doneRequisitions(search, page, limit);
    res.json(createResponse(rows));
  } catch (error) {
    next(error.message);
  }
};

// done requisition details
module.exports.doneRequisitionsDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.json(createResponse(null, "Requisition id missing", true));
    }
    const { rows: data } = await doneRequisitionsDetails(id);
    res.json(createResponse(data));
  } catch (error) {
    next(err.message);
  }
};

/*------------- post ------------*/
// post
module.exports.postRequisition = async (req, res, next) => {
  try {
    const { products, user_id } = req.body;

    if (!user_id) {
      res.json(createResponse(null, "Requisitionar Id is missing", true));
    } else if (!products.length) {
      res.json(createResponse(null, "Product is missing", true));
    } else {
      const { rows: lastReqNo } = await getLastReqNo();
      const reqNo = lastReqNo[0].LAST_ID
        ? parseInt(lastReqNo[0].LAST_ID) + 1
        : 1;

      const requisitionInfo = {
        profilehrId: user_id,
        requiTime: format(new Date(), "hh:mm a"),
        requiMonth: format(new Date(), "LLLL-yyyy"),
        requiDate: format(new Date(), "yyyy-MM-dd"),
        lastReqNo: reqNo,
        status: 0,
      };

      let insertedId = await postRequisitionInfo(requisitionInfo);
      const { outBinds } = insertedId;
      insertedId = outBinds.id[0];

      const { rows: lastId } = await lastProRequiId();
      let count = lastId[0].LAST_ID ? lastId[0].LAST_ID + 1 : 1;

      const newProducts = products.map((item) => {
        const obj = {
          PROREQID: count++,
          HRIDNO: user_id,
          REQUIID: insertedId,
          PROID: item.proid,
          PROREQUQTY: item.prorequqty,
          PREMARKS: item.remarks,
          APROQTY: 0,
          PRODATE: format(new Date(), "yyyy-MM-dd"),
          PROMONTH: format(new Date(), "LLLL-yyyy"),
        };
        return obj;
      });

      const result = await postReqProduct(newProducts);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err.message);
  }
};

module.exports.createManualRequisition = async (req, res, next) => {
  const { hrid, approvedby, requisitionBy, products } = req.body;

  let date = new Date();
  let requitime = format(date, "hh:mm a");
  let requidate = format(date, "yyyy-MM-dd");
  let requimonth = format(date, "LLLL-yyyy");

  try {
    if (!hrid || !approvedby || !requisitionBy) {
      res.json(createResponse(null, "Required Body Missing", true));
    } else {
      products.forEach((product) => {
        if (product.stockqty < product.appqty) {
          res.json(
            createResponse(
              null,
              "Approved Quantities Product Are Bigger than Stock Quantities",
              true
            )
          );
        }
      });

      const { rows: lastReqNo } = await getLastReqNo();
      const lastReqN = lastReqNo[0].LAST_ID
        ? parseInt(lastReqNo[0].LAST_ID) + 1
        : 0;

      let insertedId = await manualPostRequisitionInfo(
        lastReqN,
        hrid,
        requitime,
        requidate,
        requimonth,
        approvedby
      );
      const { outBinds } = insertedId;
      insertedId = outBinds.id[0];

      // making array for the process of ExecuteMany()
      let [preRequisitionEntry, stockProductUpdate, productSummariesEntry] = [
        [],
        [],
        [],
      ];
      if (insertedId) {
        products.forEach(async (product) => {
          // product should be an object
          const { proid, stockqty, prodqty, unit, appqty, procate, remarks } =
            product;
          if (!proid || !stockqty || !prodqty || !unit || !procate || !appqty) {
            res.json(createResponse(null, "Required Body Missing", true));
          } else {
            preRequisitionEntry.push({
              HRIDNO: hrid,
              REQUIBY: requisitionBy,
              REQUIID: insertedId,
              PROID: proid,
              PROREQUUNIT: unit,
              PROREQUQTY: prodqty,
              PREMARKS: remarks,
              APROQTY: appqty,
              REQUPRODSTATUS: 1,
              PRODATE: requidate,
              PROMONTH: requimonth,
            });

            let currentbalance = stockqty - appqty;
            stockProductUpdate.push({
              PROQTY: currentbalance,
              PROID: proid,
            });

            productSummariesEntry.push({
              PRODUCTID: proid,
              PROCAT: procate,
              INTIALQTY: stockqty,
              TOTALBALANCE: stockqty,
              TOTALOUT: appqty,
              PRESENTBALANCE: currentbalance,
              SUMMDATE: requidate,
              SUMMMONTH: requimonth,
            });
          }
        });

        const PostPR = await postProRequisition(preRequisitionEntry);
        const UpdateSP = await updateStoreProduct(stockProductUpdate);
        const PostPS = await postProductSummaries(productSummariesEntry);

        if (
          PostPR.rowsAffected >= 1 &&
          UpdateSP.rowsAffected >= 1 &&
          PostPS.rowsAffected >= 1
        ) {
          res.json(
            createResponse(
              null,
              "Manual Requisition Process Complete Successfully!!",
              false
            )
          );
        } else {
          res.json(
            createResponse(
              null,
              "Something is wrong in Manual Requisition Process!!",
              true
            )
          );
        }
      }
    }
  } catch (err) {
    next(err);
  }
};

// update requisition by admin
module.exports.updateRequisitionByAdmin = async (req, res, next) => {
  try {
    const { req_id, products, approvedBy } = req.body;

    if (!req_id) {
      res.json(createResponse(null, "Requisition id missing", true));
    }
    if (!approvedBy || !products.length) {
      res.json(createResponse(null, "Body data missing", true));
    }
    const updatedInfo = {
      REQUISTATUS: 1,
      APPROVED: 1,
      APPROVEDBY: approvedBy,
      APROVEDTIME: format(new Date(), "hh:mm a"),
      APPROVEDDATE: format(new Date(), "yyyy-MM-dd"),
      REQID: req_id,
    };
    // update requisition table
    await updateRequisitionInfo(updatedInfo);

    // update pro_requisition table
    const result = await updateReqProducts(products);
    res.json(createResponse(result));
  } catch (error) {
    next(error.message);
  }
};

// update requisition by store_officer
module.exports.updateReqByStoreOfficer = async (req, res, next) => {
  try {
    const { req_id, products } = req.body;
    if (!req_id) {
      res.json(createResponse(null, "Requisition id missing", true));
    }
    if (!products.length) {
      res.json(
        createResponse(null, "You might not select product to approve", true)
      );
    }

    products.forEach(async (item) => {
      let { rows } = await getProductBalance(item.proid);
      const balance = rows[0].PROQTY;
      const newBalance = balance - item.qty;
      // update product balance
      const data = {
        PROID: item.proid,
        PROQTY: newBalance,
      };

      await updateBalance(data);

      // update store products
      const p_info = {
        APPROQTY: item.qty,
        REQUPRODSTATUS: 1,
        STOREREMARKS: item.remarks,
        PROREQID: item.proreqid,
      };
      await updateStoreProducts(p_info);

      const dataToInsert = {
        PRODUCTID: item.proid,
        PRODUCTNAME: item.productname,
        PRODNAMETWO: item.productnametwo,
        PROCAT: item.procat,
        INTIALQTY: balance,
        TOTALBALANCE: balance,
        TOTALOUT: item.qty,
        PRESENTBALANCE: newBalance,
        SUMMDATE: format(new Date(), "yyyy-MM-dd"),
        SUMMMONTH: format(new Date(), "LLLL-yyyy"),
        REQUISITIONFOR: item.employe_id,
        SUMMERTYPE: "Out",
      };

      await insertSummeries(dataToInsert);
    });

    res.json(createResponse(null, "Requisition Approved"));
  } catch (error) {
    next(error.message);
  }
};
