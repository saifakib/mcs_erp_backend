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

// pending requisition
module.exports.pendingRequisitionDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.json(createResponse(null, "Requisition id missing", true));
    }

    const { rows: details } = await pendingRequisitionDetails(id);

    res.json(createResponse(details));
  } catch (error) {
    next(error.message);
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
  const { hrid, approvedby, products } = req.body;

  let date = new Date();
  let requitime = format(date, "hh:mm a");
  let requidate = format(date, "yyyy-MM-dd");
  let requimonth = format(date, "LLLL-yyyy");

  try {
    if (!hrid || !approvedby) {
      res.json(createResponse(null, "Required Body Missing", true));
    } else {
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

      let [preRequisitionEntry, stockProductUpdate, productSummariesEntry] = [
        [],
        [],
        [],
      ];

      if (insertedId) {
        products.forEach(async (product) => {
          // product should be an object
          const {
            prodid,
            productname,
            stockqty,
            prodqty,
            prounit,
            appqty,
            procate,
            remarks,
          } = product;
          if (
            !prodid ||
            !productname ||
            !stockqty ||
            !prodqty ||
            !prounit ||
            !procate ||
            !appqty
          ) {
            res.json(createResponse(null, "Required Body Missing", true));
          } else {
            preRequisitionEntry.push({
              HRIDNO: hrid,
              REQUIID: insertedId,
              PROID: prodid,
              PROREQUQTY: prodqty,
              PROREQUUNIT: prounit,
              PREMARKS: remarks,
              APROQTY: appqty,
              REQUPRODSTATUS: 1,
              PRODATE: requidate,
              PROMONTH: requimonth,
            });

            let currentbalance = stockqty - appqty;

            stockProductUpdate.push({
              PROQTY: currentbalance,
              PROID: prodid,
            });

            productSummariesEntry.push({
              PRODUCTID: prodid,
              PRODUCTNAME: productname,
              PRODUCTCATE: procate,
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

        res.json(
          createResponse({
            PostPR,
            UpdateSP,
            PostPS,
          })
        );
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
