const { createResponse } = require("../../../utils/responseGenerator");
const {
  postRequisitionInfo,
  postReqProduct,
  getLastReqId,
  updateRequisitionInfo,
  updateReqProducts,
} = require("../../../services/store/requisitions");
const { format } = require("date-fns");

/*------------- get ------------*/
// getLastReqId
module.exports.getLastReqId = async (req, res, next) => {
  try {
    let { rows } = await getLastReqId();
    let { LAST_ID } = rows[0];
    res.json(createResponse({ LAST_REQ_ID: LAST_ID + 1 }));
  } catch (err) {
    next(err.message);
  }
};

/*------------- post ------------*/
// post
module.exports.postRequisition = async (req, res, next) => {
  try {
    const { products, user_id, lastReqNo } = req.body;

    if (!user_id) {
      res.json(createResponse(null, "Requisitionar Id is missing", true));
    } else if (!products.length) {
      res.json(createResponse(null, "Product is missing", true));
    } else {
      const reqTableInfo = {
        profilehrId: user_id,
        requiTime: format(new Date(), "hh:mm a"),
        requiMonth: format(new Date(), "LLLL-yyyy"),
        requiDate: format(new Date(), "yyyy-MM-dd"),
        lastReqNo,
        status: 0,
      };

      const { outBinds } = await postRequisitionInfo(reqTableInfo);
      // get last inserted_id
      const insertedId = outBinds.id[0];
      if (insertedId) {
        const detailsInfo = products.map((item) => {
          const object = {
            HRIDNO: user_id,
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
