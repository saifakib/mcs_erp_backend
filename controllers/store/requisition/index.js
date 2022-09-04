const { createResponse } = require("../../../utils/responseGenerator");
const {
  postRequisitionInfo,
  postReqProduct,
  getLastReqId,
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
