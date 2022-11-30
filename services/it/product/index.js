const { ExecuteIT, ExecuteITMany } = require("../../../utils/itDynamicController");
const { oracledb } = require("../../../db/db");

/*------------- Get ------------*/











/*------------- Post ------------*/
// Product Entries
const insertMrrLogs = (
    {
        mrr_no,
        supplier_id,
        suppdate,
        workorder,
        cashmemono,
        cashmemodate,
        user_id,
    },
    currentDate
) =>
    ExecuteIT(
        `INSERT INTO MRRLOGS (MRR_NO, SUP_ID, SUPP_DATE, WORK_ORDER, CASHMEMO_NO, CASHMEMO_DATE, ENTRY_DATE, ENTRY_BY) VALUES (${Number(
            mrr_no
        )}, ${Number(
            supplier_id
        )}, TO_DATE('${suppdate}', 'YYYY-MM-DD'), '${workorder}', '${cashmemono}', TO_DATE('${cashmemodate}', 'YYYY-MM-DD'), TO_DATE('${currentDate}', 'YYYY-MM-DD'), ${Number(user_id)}) RETURN MRR_LOG_ID INTO :id`,
        { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );


// Store Product
const insertStoreProduct = ({
    model_id,
    pro_id,
    brand_id,
    unit_id,
    qty,
    price,
    stock_alert,
    remarks
}) =>
    ExecuteIT(
        `INSERT INTO STORE_PRODUCTS (MODEL_ID, PRO_ID, BRAND_ID, UNIT_ID, QUANTITY, PRICE, STOCK_ALERT, REMARKS) VALUES (${Number(model_id)}, ${Number(pro_id)}, ${Number(
            brand_id
        )}, ${Number(unit_id)}, ${Number(qty)}, ${Number(price)}, ${Number(
            stock_alert
        )}, '${remarks}') RETURN STR_PRO_ID INTO :id`,
        { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );


// Product Entries Lists
const insertProductEntryLists = (
    { qty, price },
    mrr_id,
    supplier_id,
    store_pro_id,
    currentDate
) =>
    ExecuteIT(
        `INSERT INTO PRODUCT_ENTRY_LIST (MRR_ID, SUP_ID, STR_PRO_ID, QUANTITES, AMOUNT, ENTRY_DATE) VALUES (${Number(
            mrr_id
        )}, ${Number(supplier_id)}, ${Number(store_pro_id)}, ${Number(qty)}, ${Number(
            price
        )}, TO_DATE('${currentDate}', 'YYYY-MM-DD')) RETURN PRO_EN_L_ID INTO :id`,
        { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );

const insertProdSummaries = (
    { qty, price },
    store_pro_id,
    currentDate
) =>
    ExecuteIT(
        `INSERT INTO PRODUCT_SUMMARIES (STR_PRO_ID, INITIAL_QTY, CURRENT_PRICE, SUMDATE, SUM_TYPE) VALUES (${Number(
            store_pro_id
        )}, ${Number(qty)}, ${Number(
            price
        )}, TO_DATE('${currentDate}','YYYY-MM-DD'), 'In') RETURN SUMMARY_ID INTO :id`,
        { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );


module.exports = {
    insertMrrLogs, insertStoreProduct, insertProductEntryLists, insertProdSummaries,

}