const { createResponse } = require("../../../utils/responseGenerator");
const { insertLogActivity } = require("../../../services/store/logActivity");


/*------------- All Post Routes ---------------*/


// products
const postLogActivity = async (req, res, next) => {
  try {
    const { action_type, log_detail } = req.body;
    const hrid = req.employe_id;
    console.log(hrid)
    console.log(req.body);
    res.json(createResponse());
  } catch (err) {
    next(err);
  }
};

/*------------- End ---------------*/



module.exports = {
    postLogActivity
}

