const { createResponse } = require("../../../utils/responseGenerator");
const { selectSupplierWithProductEntriesInfo, selectMrrProListBySupplierId} = require("../../../services/it/mrr")

const manageSupplier = async (req, res, next) => {
    try {
        const suppliersWithEntriesInfo = await selectSupplierWithProductEntriesInfo();
        const response = {
            suppliersWithEntriesInfo: suppliersWithEntriesInfo.rows
        };
        res.json(createResponse(response));
    } catch (err) {
        next(err);
    }
};

const mrrProListBySupId = async (req, res, next) => {
    const { supplier_id } = req.params;
    try {
      if (!supplier_id) {
        res.json(createResponse(null, "Required Parameter Missing", true));
      } else {
        let response = await selectMrrProListBySupplierId(supplier_id);
  
        let result = {};
  
        if (response.rows.length > 0) {
          result = response.rows.reduce((acc, val) => {
            let obj = {
              SUP_ID: val.SUP_ID,
              MRRID: val.MRR_ID,
              MRRNUMBER: val.MRR_NO,
              ENTRY_DATE: val.ENTRY_DATE,
            };
            if (acc[val.ENTRY_DATE]) {
              acc[val.ENTRY_DATE].push(obj);
            } else {
              acc[val.ENTRY_DATE] = [];
              acc[val.ENTRY_DATE].push(obj);
            }
            return acc;
          }, {});
        }

        console.log(result)
  
        let result2 = Object.keys(result).reduce((acc, key) => {
          let createObj = {
            ENTRY_DATE: key,
            MRR: result[key],
          };
          acc.push({ ...createObj });
          return acc;
        }, []);
  
        res.json(createResponse(result2));
      }
    } catch (err) {
      next(err);
    }
  };


module.exports = {
    manageSupplier,
    mrrProListBySupId
}
