const { createResponse } = require("../../../utils/responseGenerator");
const { postRequisitionInfo } = require("../../../services/store/requisitions");

module.exports.postRequisition = async (req, res, next) => {
  try {
    const { products, user_id } = req.body;

    if (!user_id) {
      res.json(createResponse(null, "Requisitionar Id is missing", true));
    } else if (!products.length) {
      res.json(createResponse(null, "Product is missing", true));
    } else {
      const productId = await postRequisitionInfo(user_id);
      // res.json(createResponse(rows));
    }
  } catch (err) {
    next(err.message);
  }
};
