const { createResponse } = require("../../../utils/responseGenerator");
const {
  assetProducts, assetIndProduct, userIndProduct, userNotExitProducts,
  insertAssetProduct,
  deleteAssetProduct,
  updateAssetProduct,
  assetManual,
  insertAssetManual,
  assetManualById,
  updateAssetManual,
  updateAssetManualStatus,
  assetManualPersonReport,
  assetManualDepReport,
} = require("../../../services/it/asset");

// Asset Product
const getAssetProducts = async (_, res, next) => {
  try {
    const result = await assetProducts();
    res.json(createResponse(result.rows));
  } catch (err) {
    next(err.message);
  }
};

// User Not exit Product
const getUserNotExitProducts = async (req, res, next) => {
  const { employee_id } = req.params;
  try {
    if (!employee_id) {
      res.json(createResponse(null, "Required Parameter missing", true))
    } else {
      const result = await userNotExitProducts(employee_id);
      res.json(createResponse(result.rows));
    }
  } catch (err) {
    next(err.message);
  }
}
const postAssetProducts = async (req, res, next) => {
  try {
    const check = await assetIndProduct(req.body.p_name);
    if (check.rows.length > 0) {
      res.json(createResponse(null, "Product Already Exit"), true);
    } else {
      const result = await insertAssetProduct(req.body);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

const deleteAssetProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    if ((typeof (id) !== number && !id)) {
      res.json(createResponse(null, "Something went wrong", true))
    } else {
      const data = { ID: id };
      const result = await deleteAssetProduct(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

const putAssetProducts = async (req, res, next) => {
  try {
    const { p_name } = req.body;
    const { id } = req.headers;

    const check = await assetIndProduct(req.body.p_name);
    if (check.rows.length > 0 && check.rows[0].id !== id) {
      res.json(createResponse(null, "Product Already Exit"), true);
    } else {
      const data = {
        P_NAME: p_name,
        ID: parseInt(id),
      };
      const result = await updateAssetProduct(data);
      res.json(createResponse(result));
    }
  } catch (err) {
    next(err);
  }
};

// AssetManual
const getAssetManual = async (req, res, next) => {
  try {
    const result = await assetManual(req.body);
    res.json(createResponse(result.rows));
  } catch (err) {
    next(err);
  }
};

const getAssetManualById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ID: id };
    const result = await assetManualById(data);
    res.json(createResponse(result.rows));
  } catch (err) {
    next(err);
  }
};


const postAssetManual = async (req, res, next) => {
  try {
    const check = await userIndProduct(req.body.employee_id, req.body.product_id);
    if (check.rows.length > 0) {
      res.json(createResponse(null, "Product Already In User"), true);
    }
    const result = await insertAssetManual(req.body);
    res.json(createResponse(result));
  } catch (err) {
    next(err);
  }
};


const putAssetManual = async (req, res, next) => {
  try {
    const { emp_id } = req.headers;
    const { v_file } = req.body;
    const data = { ID: emp_id, V_FILE: v_file };
    const result = await updateAssetManual(data);
    res.json(createResponse(result.rows));
  } catch (err) {
    next(err);
  }
};
const putAssetManualStatus = async (req, res, next) => {
  try {
    const { id } = req.headers;
    const data = { ID: id, STATUS: 1 };
    const result = await updateAssetManualStatus(data);
    res.json(createResponse(result.rows));
  } catch (err) {
    next(err);
  }
};

// report 
const getAssetManualPersonReport = async (req, res, next) => {
  const { emp_id } = req.params;
  try {
    if (typeof emp_id !== "number" && !emp_id) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const { rows: result } = await assetManualPersonReport(emp_id);
      let response = result.reduce((acc, obj, index) => {
        let newObj = {
          P_NAME: obj.P_NAME,
          DETAILS: obj.DETAILS,
          YEAR: obj.YEAR,
          QUANTITY: obj.QUANTITY,
          SOURCE: obj.SOURCE,
          FILES: obj.FILES,
          V_FILE: obj.V_FILE,
          ENTRY_DATE: obj.ENTRY_DATE,
        };
        acc[index] = newObj;
        return acc;
      }, []);
      res.json(
        createResponse(
          {
            user: {
              NAME_ENGLISH: result[0].NAME_ENGLISH,
              DEPARTEMENT: result[0].DEPARTEMENT,
              DESIGNATION: result[0].DESIGNATION,
              DESIGNATION_BANGLA: result[0].DESIGNATION_BANGLA,
              MOBILE_PHONE: result[0].MOBILE_PHONE,
              NAME_BANGLA: result[0].NAME_BANGLA,
              EMP_ID: result[0].EMP_ID,

            },
            products: response,
            totalProducts: response.length,
          },
          "Individual User Taken Products"
        )
      );
    }
  } catch (err) {
    next(err);
  }
};
const getAssetManualDepartmentReport = async (req, res, next) => {
  const { dep_id } = req.params;
  try {
    if (typeof dep_id !== "number" && !dep_id) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const { rows: result } = await assetManualDepReport(dep_id);
      let employeesArr = result.reduce((acc, obj) => {
        if (acc[obj.EMP_ID]) {
          acc[obj.EMP_ID].push(obj);
        } else {
          acc[obj.EMP_ID] = [];
          acc[obj.EMP_ID].push(obj);
        }
        return acc;
      }, {});

      let response = Object.keys(employeesArr).map((indEm) => {
        return employeesArr[indEm].reduce((acc, obj, index) => {
          if (index == 0) {
            acc["user"] = {
              NAME_ENGLISH: obj.NAME_ENGLISH,
              DEPARTEMENT: obj.DEPARTEMENT,
              DESIGNATION: obj.DESIGNATION,
              DESIGNATION_BANGLA: obj.DESIGNATION_BANGLA,
              MOBILE_PHONE: obj.MOBILE_PHONE,
              NAME_BANGLA: obj.NAME_BANGLA,
              EMP_ID: obj.EMP_ID,
            };
          }
          let newObj = {
            P_NAME: obj.P_NAME,
            PRO_ID: obj.PRO_ID,
            DETAILS: obj.DETAILS,
            YEAR: obj.YEAR,
            QUANTITY: obj.QUANTITY,
            SOURCE: obj.SOURCE,
            FILES: obj.FILES,
            V_FILE: obj.V_FILE,
            ENTRY_DATE: obj.ENTRY_DATE,
          };
          if (acc["products"]) {
            acc["products"][obj.PRO_ID] = newObj;
          } else {
            acc["products"] = {};
            acc["products"][obj.PRO_ID] = newObj;
          }
          return acc;
        }, {});
      });
      res.json(createResponse(response, "Department Wise Person Products"));
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAssetProducts, getUserNotExitProducts, 
  postAssetProducts,
  deleteAssetProducts,
  putAssetProducts,
  getAssetManual,
  postAssetManual,
  getAssetManualById,
  putAssetManual,
  putAssetManualStatus,
  getAssetManualPersonReport,
  getAssetManualDepartmentReport,
};
