const { createResponse } = require("../../../utils/responseGenerator");
const { postRequisitionInfo } = require("../../../services/store/requisitions");

module.exports.postRequisition = async (req, res, next) => {
  try {
    const { user_id } = req.headers;
    const { products, status } = req.body;

    const reqInfo = {
      user_id,
    };

    if (!user_id && !products) {
      res.json(createResponse(null, "Data Missing", true));
    } else {
      const data = await postRequisitionInfo(user_id);
      // res.json(createResponse(rows));
    }
  } catch (err) {
    next(err.message);
  }
};
