const { createResponse } = require("../../../utils/responseGenerator");
const { selectCategoryProductsWTStatus , selectUserNotAccessProduct, selectUserNotAccessProductInd, insertProdNotAccessToUser, deleteProdNotAccessToUser } = require("../../../services/store/systemAccess");
const { getEmployee } = require("../../../services/hr/employee")

/*------------- All Get Routes ---------------*/

// Show All Product by a category aganist a user
const getCategoryAllProdWAccess = async (req, res, next) => {
    try {
        const { empid, catid } = req.params;
        if (!empid && !catid) {
            res.json(createResponse(null, "Required Parameter Missing", true));
          } else {
            const result = await selectCategoryProductsWTStatus(empid, catid);
            res.json(createResponse(result.rows));
          }
    } catch (err) {
        next(err.message)
    }
}

// get a single user product
const getUserNotAccessProduct = async (req, res, next) => {
  try {
    const { empid } = req.params;
    if (!empid) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const result = await selectUserNotAccessProduct(empid);
      const employee = await getEmployee(empid);
      res.json(createResponse({
        employee: employee.rows[0],
        accessProducts: result.rows
      }));
    }
  } catch (err) {
    next(err.message);
  }
};


/*------------- End ---------------*/

/*------------- All Post Routes ---------------*/

const postProdNotAccesstoUser = async (req, res, next) => {
    try {
        const { empid, proid } = req.body;
        if (!empid && !proid) {
            res.json(createResponse(null, "Required Field Missing", true));
        } else {
            const isExit = await selectUserNotAccessProductInd(empid, proid);
            if(isExit.rows[0].COUNT === 0) {
                const result = await insertProdNotAccessToUser({ empid, proid });
                if (result.rowsAffected === 1) {
                    res.json(createResponse(null, "No Access", false));
                } else {
                    res.json(createResponse(null, "Something error", true));
                }
            } else {
                res.json(createResponse(null, "Already No Access", true));
            }
        }
    } catch (err) {
        next(err);
    }
};


/*------------- End ---------------*/


/*------------- All Delete Routes ---------------*/

const removeProdNotAccesstoUser = async (req, res, next) => {
    try {
        const { empid, proid } = req.headers;
        if (!empid && !proid) {
            res.json(createResponse(null, "Required Field Missing", true));
        } else {
            const result = await deleteProdNotAccessToUser({ empid, proid });
            if (result.rowsAffected === 1) {
                res.json(createResponse(null, "Access", false));
            } else {
                res.json(createResponse(null, "Something error", true));
            }
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { getCategoryAllProdWAccess, getUserNotAccessProduct, postProdNotAccesstoUser, removeProdNotAccesstoUser }
