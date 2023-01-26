const { createResponse } = require("../../../utils/responseGenerator");
const {
  isReqPending,
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
  updateReqByStore,
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
  reqAcceptByUser,
  denyRequisition,
  updateProReqOnDeny,
  deniedRequisitions,
  deniedRequisitionsDetails,
  doneReqProducts,
  deniedReqProducts,
  getTotalProductByUser,
  signaturesOfApproval,
  employeeSignature,
  getStoreRoles,
  singleStoreRoles,
  updateStoreRoles,
} = require("../../../services/store/requisitions");
const { format } = require("date-fns");

// is pending\
module.exports.isReqPending = async (req, res, next) => {
  try {
    const employe_id = req.employe_id;
    if (!employe_id) {
      res.json(createResponse(null, "Employee id required", true));
    } else {
      const { rows } = await isReqPending(employe_id);
      const data = rows[0];
      if (data) {
        res.json(createResponse(data));
      } else {
        res.json(createResponse({}, "No requisition found", true));
      }
    }
  } catch (error) {
    next(error.message);
  }
};

/*------------- get ------------*/
module.exports.getRequisitionById = async (req, res, next) => {
  try {
    const { search } = req.headers;
    const { page, limit } = req.query;
    const id = req.employe_id;
    if (!id) {
      res.json(createResponse(null, "User id missing", true));
    } else if (!search || !page || !limit) {
      res.json(createResponse(null, "Parameter missing", true));
    } else {
      const { rows } = await getRequisitionById(id, search, page, limit);

      const { rows: totals } = await getTotalProductByUser(id);
      const totalCount = totals[0];

      res.json(createResponse({ rows, totalCount }));
    }
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
    next(error.message);
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

        if (lastData !== undefined && lastData.PROID === item.PROID) {
          obj = {
            PROREQID: item.PROREQID,
            PRONAME: item.PRONAME,
            PROREQUQTY: item.PROREQUQTY,
            PROID: item.PROID,
            UNIT: item.UNIT,
            PREMARKS: item.PREMARKS,
            LAST_DATE: lastData.PRODATE,
            LAST_QTY: lastData.PROREQUQTY,
            REQUIID: item.REQUIID,
            HRIDNO: item.HRIDNO,
            PROID: item.PROID,
            REMAKRS: item.PREMARKS,
            UNIT: item.UNIT,
            PROCATE: item.PROCATE,
            APROQTY: item.PROREQUQTY,
            ADMINREMARKS: item.APPROVEREMARKS,
            PROQTY: item.PROQTY,
          };
        } else {
          obj = {
            PROREQID: item.PROREQID,
            PRODUCT_NAME: item.PRODUCT_NAME,
            PROREQUQTY: item.PROREQUQTY,
            PROID: item.PROID,
            UNIT: item.UNIT,
            PREMARKS: item.PREMARKS,
            LAST_DATE: null,
            LAST_QTY: 0,
            REQUIID: item.REQUIID,
            HRIDNO: item.HRIDNO,
            PROID: item.PROID,
            REMAKRS: item.PREMARKS,
            UNIT: item.UNIT,
            PROCATE: item.PROCATE,
            APROQTY: item.PROREQUQTY,
            ADMINREMARKS: item.APPROVEREMARKS,
            PROQTY: item.PROQTY,
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

    // total qty
    const totalQty = detailProducts.reduce((accumulator, object) => {
      return accumulator + object.PROREQUQTY;
    }, 0);

    res.json(
      createResponse({
        reqInfo,
        stockInfo,
        productsInfo: detailProducts,
        totalQty,
      })
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
        if (lastData !== undefined && lastData.PROID === item.PROID) {
          obj = {
            PROREQID: item.PROREQID,
            PRONAME: item.PRONAME,
            PRONAMETWO: item.PRONAMETWO,
            PROREQUQTY: item.PROREQUQTY,
            PROID: item.PROID,
            UNIT: item.UNIT,
            LAST_DATE: lastData.PRODATE,
            LAST_QTY: lastData.PROREQUQTY,
            USER_REMARKS: item.PREMARKS,
            ADMIN_REMARKS: item.APPROVEREMARKS,
            HRIDNO: item.HRIDNO,
            PROCATE: item.PROCATE,
            PROQTY: item.PROQTY,
            APROQTY: item.APROQTY,
          };
        } else {
          obj = {
            PROREQID: item.PROREQID,
            PRONAME: item.PRONAME,
            PRONAMETWO: item.PRONAMETWO,
            PROREQUQTY: item.PROREQUQTY,
            PROID: item.PROID,
            USER_REMARKS: item.PREMARKS,
            ADMIN_REMARKS: item.APPROVEREMARKS,
            HRIDNO: item.HRIDNO,
            UNIT: item.UNIT,
            LAST_DATE: null,
            LAST_QTY: 0,
            PROCATE: item.PROCATE,
            PROQTY: item.PROQTY,
            APROQTY: item.APROQTY,
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

    // total qty
    const totalQty = detailProducts.reduce((accumulator, object) => {
      return accumulator + object.PROREQUQTY;
    }, 0);

    res.json(
      createResponse({
        reqInfo,
        productsInfo: detailProducts,
        adminApproved: adminInfo,
        stockInfo,
        totalQty,
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

    // get products
    const { rows: products } = await doneReqProducts(id);

    const { rows: approvalSignatures } = await signaturesOfApproval();
    const { rows: signature } = await employeeSignature(id);
    let empSignature = signature[0];
    if (empSignature !== undefined) {
      empSignature["ROLE_ID"] = null;
    }
    const signatures = [...approvalSignatures, empSignature];

    const total = products.reduce(
      (acc, obj) => {
        (acc[0] += obj.APROQTY), (acc[1] += obj.PROREQUQTY);
        return acc;
      },
      [0, 0]
    );

    res.json(
      createResponse({
        userInfo: data,
        products,
        signatures,
        totalAppQty: total[0],
        totalRequQty: total[1],
      })
    );
  } catch (error) {
    next(error.message);
  }
};

// denied requisition
module.exports.deniedRequisitions = async (req, res, next) => {
  try {
    const { search } = req.headers;
    const { page, limit } = req.query;

    if (!search) {
      res.json(createResponse(null, "Search parameter missing", true));
    }
    if (!page || !limit) {
      res.json(createResponse(null, "Parameter missing", true));
    }
    const { rows } = await deniedRequisitions(search, page, limit);
    res.json(createResponse(rows));
  } catch (error) {
    next(error.message);
  }
};

// denied requisition details
module.exports.deniedRequisitionsDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.json(createResponse(null, "Requisition id missing", true));
    }
    const { rows: data } = await deniedRequisitionsDetails(id);

    // get products
    const { rows: products } = await deniedReqProducts(id);

    res.json(createResponse({ userInfo: data, products }));
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
      const reqNo = lastReqNo.length === 0 ? 1 : lastReqNo[0].REQUISITIONNO
        ? parseInt(lastReqNo[0].REQUISITIONNO) + 1
        : 1;
      

      const requisitionInfo = {
        profilehrId: user_id,
        requiTime: format(new Date(), "hh:mm a"),
        requiMonth: format(new Date(), "LLLL-yyyy"),
        requiDate: format(new Date(), "yyyy-MM-dd"),
        lastReqNo: reqNo,
        status: 0,
        approve: 0,
        storeaccept: 0,
        proaccept: 0,
        deny: 0,
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
      res.json(createResponse(null));
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
      if (products.length == 0) {
        res.json(createResponse(null, "Product Body Missing", true));
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
        const lastReqN = lastReqNo[0].REQUISITIONNO
          ? parseInt(lastReqNo[0].REQUISITIONNO) + 1
          : 1;

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
            if (
              !proid ||
              !stockqty ||
              !prodqty ||
              !unit ||
              !procate ||
              !appqty
            ) {
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
    }
  } catch (err) {
    next(err.message);
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
    const { req_id, approvedBy, products } = req.body;

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
      let balance = rows[0].PROQTY;
      let newBalance = balance - item.qty;

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
        PRODUCTNAME: item.proname,
        PROCAT: item.procate,
        INTIALQTY: balance,
        TOTALBALANCE: balance,
        TOTALOUT: item.qty,
        PRESENTBALANCE: newBalance,
        SUMMDATE: format(new Date(), "yyyy-MM-dd"),
        SUMMMONTH: format(new Date(), "LLLL-yyyy"),
        REQUISITIONFOR: item.hridno,
        SUMMERTYPE: "Out",
      };

      await insertSummeries(dataToInsert);
    });

    const data = {
      REQUISTATUS: 3,
      STOREACCEPT: 1,
      APPROVEDBY: approvedBy,
      APROVEDTIME: format(new Date(), "hh:mm a"),
      APPROVEDDATE: format(new Date(), "yyyy-MM-dd"),
      REQID: req_id,
    };

    const result = await updateReqByStore(data);
    if (result) {
      res.json(createResponse(null, "Requisition Approved"));
    }
  } catch (error) {
    next(error.message);
  }
};

// requisition accept by user
module.exports.reqAcceptByUser = async (req, res, next) => {
  try {
    const { req_id } = req.body;
    if (!req_id) {
      res.json(createResponse(null, "Requisitions id missing", true));
    } else {
      const data = {
        REQID: req_id,
        PROACCEPT: 1,
        PROACCEPTTIME: format(new Date(), "hh:mm a"),
        PROACCEPTDATE: format(new Date(), "yyyy-MM-dd"),
      };

      const finalUpdate = await reqAcceptByUser(data);
      if (finalUpdate.rowsAffected >= 1) {
        res.json(createResponse(null, "Requisition Approved"));
      }
    }
  } catch (error) {
    next(error.message);
  }
};

// deny requisition by admin
module.exports.denyRequisition = async (req, res, next) => {
  try {
    const { req_id, denyRemarks, user_name } = req.body;
    if (!req_id) {
      res.json(createResponse(null, "Requisition id missing", true));
    }
    const data = {
      REQUISTATUS: 2,
      DENY: 1,
      DENYREMAKRS: denyRemarks,
      DENYBY: user_name,
      DENYTIME: format(new Date(), "hh:mm a"),
      DENYDATE: format(new Date(), "yyyy-MM-dd"),
      REQID: Number(req_id),
    };

    // update pro_requisition table
    await updateProReqOnDeny(req_id);

    // update requisitation table
    const deny = await denyRequisition(data);

    if (deny) {
      res.json(createResponse(deny, "Requisition has been denied"));
    }
  } catch (error) {
    next(error.message);
  }
};

// roles
module.exports.getStoreRoles = async (req, res, next) => {
  try {
    const { rows } = await getStoreRoles();
    res.json(createResponse(rows));
  } catch (error) {
    next(error.message);
  }
};

module.exports.singleStoreRoles = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.json(createResponse(null, "Id missing", true));
    } else {
      const { rows } = await singleStoreRoles(id);
      const data = rows[0];
      res.json(createResponse(data));
    }
  } catch (error) {
    next(error.message);
  }
};

module.exports.updateStoreRoles = async (req, res, next) => {
  try {
    const { id: role_id } = req.params;
    const { emp_id } = req.body;

    if (!emp_id && !role_id) {
      res.json(createResponse(null, "Parameter missing", true));
    } else {
      const result = await updateStoreRoles(role_id, emp_id);
      res.json(createResponse(result));
    }
  } catch (error) {
    next(error.message);
  }
};
