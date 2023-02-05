const { createResponse } = require("../../../utils/responseGenerator");
const { selectUserAccessProduct, insertProdAccessToUser, deleteProdAccessToUser } = require("../../../services/store/systemAccess");
const { getEmployee } = require("../../../services/hr/employee")

/*------------- All Get Routes ---------------*/

// get a single user product
const getUserAccessProduct = async (req, res, next) => {
  try {
    const { empid } = req.params;
    if (!empid) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const result = await selectUserAccessProduct(empid);
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

// category
const postProdAccesstoUser = async (req, res, next) => {
    try {
        const { empid, proid } = req.body;
        if (!empid && !proid) {
            res.json(createResponse(null, "Required Field Missing", true));
        } else {
            const result = await insertProdAccessToUser({ empid, proid });
            if (result.rowsAffected === 1) {
                res.json(createResponse(null, "Access", true));
            } else {
                res.json(createResponse(null, "Something error", true));
            }
        }
    } catch (err) {
        next(err);
    }
};


/*------------- End ---------------*/

/*------------- All Update Routes ---------------*/

/*------------- End ---------------*/

/*------------- All Delete Routes ---------------*/

const removeProdAccesstoUser = async (req, res, next) => {
    try {
        const { empid, proid } = req.body;
        if (!empid && !proid) {
            res.json(createResponse(null, "Required Field Missing", true));
        } else {
            const result = await deleteProdAccessToUser({ empid, proid });
            if (result.rowsAffected === 1) {
                res.json(createResponse(null, "Access Remove", true));
            } else {
                res.json(createResponse(null, "Something error", true));
            }
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { getUserAccessProduct, postProdAccesstoUser, removeProdAccesstoUser }
