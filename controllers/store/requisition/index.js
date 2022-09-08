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

/*------------- post ------------*/
// post
module.exports.postRequisition = async (req, res, next) => {
  try {
    const { products, user_id } = req.body;
    console.log(user_id);

    if (!user_id) {
      res.json(createResponse(null, "Requisitionar Id missing", true));
    }
    if (!products.length) {
      res.json(createResponse(null, "Product is missing", true));
    } else {
      let { rows } = await getLastReqNo();
      let { LAST_ID } = rows[0];

      const reqTableInfo = {
        profilehrId: Number(user_id),
        requiTime: format(new Date(), "hh:mm a"),
        requiMonth: format(new Date(), "LLLL-yyyy"),
        requiDate: format(new Date(), "yyyy-MM-dd"),
        lastReqNo: LAST_ID + 1,
        status: 0,
      };

      const { outBinds } = await postRequisitionInfo(reqTableInfo);
      // get last inserted_id
      const insertedId = outBinds.id[0];
      if (insertedId) {
        let { rows } = await lastProRequiId();
        let { LAST_ID } = rows[0];
        let count = LAST_ID === null ? 1 : LAST_ID + 1;
        const detailsInfo = products.map((item) => {
          const object = {
            PROREQID: count++,
            HRIDNO: Number(user_id),
            REQUIID: insertedId,
            PROID: item.proid,
            PROREQUQTY: item.prorequqty,
            PREMARKS: item.remarks,
            APROQTY: 0,
            PRODATE: format(new Date(), "yyyy-MM-dd"),
            PROMONTH: format(new Date(), "LLLL-yyyy"),
          };
          return object;
        });
        const result = await postReqProduct(detailsInfo);
        res.json(createResponse(result));
      } else {
        res.json(
          createResponse(null, "Error occured on requisition post", true)
        );
      }
    }
  } catch (err) {
    next(err.message);
  }
};

// update requisition by admin
module.exports.updateRequisitionByAdmin = async (req, res, next) => {
  try {
    const { approvedProducts, approvedBy } = req.body;
    const { reqid } = req.headers;

    if (!reqid) {
      res.json(createResponse(null, "Requisition id missing", true));
    }
    if (!approvedBy || !approvedProducts.length) {
      res.json(createResponse(null, "Body data missing", true));
    }
    const updatedInfo = {
      REQUISTATUS: 1,
      APPROVED: 1,
      APPROVEDBY: approvedBy,
      APROVEDTIME: format(new Date(), "hh:mm a"),
      APPROVEDDATE: format(new Date(), "yyyy-MM-dd"),
      REQID: reqid,
    };
    // update requisition table
    await updateRequisitionInfo(updatedInfo);

    // update pro_requisition table
    const result = await updateReqProducts(approvedProducts);
    res.json(createResponse(result));
  } catch (error) {
    next(error.message);
  }
};

// update requisition by store_officer
module.exports.updateReqByStoreOfficer = async (req, res, next) => {
  try {
    res.json(createResponse(null, "Success"));
  } catch (error) {
    next(error.message);
  }
};
