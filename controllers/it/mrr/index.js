const { createResponse } = require("../../../utils/responseGenerator");
const { selectSupplierWithProductEntriesInfo, selectMrrProListBySupplierId, selectmrrByMrrno, selectProductEntriLists } = require("../../../services/it/mrr");
const { selectSupplier } = require("../../../services/it/settings")
const { format } = require("date-fns")

/**
 * Manage Supplier Conrtoller
 */
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


/**
 * Get Product List By Supplier Id
 * @param {Number} supplier_id
 */
const mrrProListBySupId = async (req, res, next) => {
  const { supplier_id } = req.params;
  try {
    if (typeof (supplier_id) !== 'number' && !supplier_id) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      let response = await selectMrrProListBySupplierId(supplier_id);

      let result = {};

      if (response.rows.length > 0) {
        result = response.rows.reduce((acc, val) => {
          const da = new Date(val.ENTRY_DATE);
          const entrydate = da.toLocaleDateString("es-CL");
          let obj = {
            SUP_ID: val.SUP_ID,
            MRRID: val.MRR_ID,
            MRRNUMBER: val.MRR_NO,
          };
          if (acc[entrydate]) {
            acc[entrydate].push(obj);
          } else {
            acc[entrydate] = [];
            acc[entrydate].push(obj);
          }
          return acc;
        }, {});
      }

      let result2 = Object.keys(result).reduce((acc, key, index) => {
        let createObj = {
          ENTRY_DATE: key,
          SERIAL: ++index,
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


/**
 * All Product Lists With Supplier Info with mrrno
 * @param {Number} supplier_id
 * @param {Number} mrr_no
 */
const viewProductReceptBySupIdMrr = async (req, res, next) => {
  const { supplier_id, mrr_no } = req.params;

  try {
    if ((typeof (supplier_id) !== 'number' && !supplier_id ) && (typeof (mrr_no) !== 'number' && !mrr_no )) {
      res.json(createResponse(null, "Required Parameter Missing", true));
    } else {
      const suppliers = await selectSupplier(supplier_id);
      const entriesInfo = await selectmrrByMrrno(mrr_no, supplier_id);
      const entriLists = await selectProductEntriLists(supplier_id, entriesInfo.rows[0].MRR_LOG_ID);

      const total = entriLists.rows.reduce(
        (acc, obj) => {
          (acc[0] += obj.QUANTITES),
            (acc[1] += obj.QUANTITES * obj.PRICE);
          return acc;
        },
        [0, 0]
      );

      let entriesInfoEd = {
        ...entriesInfo.rows[0],
        SUPP_DATE: format(new Date(entriesInfo.rows[0].SUPP_DATE), "yyyy-MM-dd"),
        WORK_ORDER_DATE: format(new Date(entriesInfo.rows[0].WORK_ORDER_DATE), "yyyy-MM-dd"),
        CASHMEMO_DATE: format(new Date(entriesInfo.rows[0].CASHMEMO_DATE), "yyyy-MM-dd"),
      };

      let response = {
        suppliers: suppliers.rows[0],
        entriesInfo: entriesInfoEd,
        entriLists: entriLists.rows,
        totalQuantities: total[0],
        totalProAmount: total[1],
      };

      res.json(createResponse(response, "Individial MRR Product Details Lists"));
    }
  } catch (err) {
    next(err);
  }
};


module.exports = { manageSupplier, mrrProListBySupId, viewProductReceptBySupIdMrr }
