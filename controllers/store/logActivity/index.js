const { createResponse } = require("../../../utils/responseGenerator");
const { selectLogActivityFilter, insertLogActivity } = require("../../../services/store/logActivity");
const { queryFieldValidator } = require("../../../utils/queryFieldValidator");


/*------------- All GET Routes ---------------*/
const getLogActivity = async (req, res, next) => {
  try {
    let isExitsColoms = queryFieldValidator(['hrid', 'module', 'submodule', 'action_type'], req.query);
    if (isExitsColoms.response) {
      let modifyQuery = Object.keys(req.query).reduce((acc, key, index) => {
        if (key == 'hrid') {
          req.query[key] = Number(req.query[key]);
        } else {
          req.query[key] = `'${req.query[key]}'`;
        }
        if (index != 0) {
          acc = acc.concat('', ` AND LOWER(${key}) = LOWER(${req.query[key].toLocaleLowerCase()})`);
        } else {
          if(key == 'hrid') {
            acc = acc.concat(acc, `WHERE ${key} = ${req.query[key]}`);
          } else {
            acc = acc.concat(acc, `WHERE LOWER(${key}) = LOWER(${req.query[key].toLocaleLowerCase()})`);
          }
        }
        return acc;
      }, "");

      console.log(modifyQuery)

      const response = await selectLogActivityFilter(modifyQuery);
      res.json(createResponse(response.rows));
    } else {
      res.json(createResponse(null, isExitsColoms.err, true));
    }

  } catch (err) {
    next(err)
  }
}


/*------------- End ---------------*/


/*------------- All POST Routes ---------------*/


const postLogActivity = async (req, res, next) => {
  try {
    const { action_type, log_detail, module, submodule } = req.body;
    const hrid = req.employe_id;
    const postLogs = await insertLogActivity({ hrid, action_type, log_detail, module, submodule });
    if (postLogs.rowsAffected == 1) {
      res.json({ message: "Log Insert", error: false })
    } else {
      res.json(createResponse({ message: "Error Occured", error: true }));
    }
    res.json(createResponse());
  } catch (err) {
    next(err);
  }
};

/*------------- End ---------------*/



module.exports = {
  getLogActivity,
  postLogActivity
}

