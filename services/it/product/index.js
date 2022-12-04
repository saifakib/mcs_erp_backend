const { ExecuteIT, ExecuteITMany } = require("../../../utils/itDynamicController");
const { oracledb } = require("../../../db/db");

/*------------- SELECT ------------*/
const selectNewProductListByCatId = (CAT_ID) =>
    ExecuteIT(
        `SELECT * FROM PRODUCT_LIST PL WHERE PL.CATEGORY_ID = ${CAT_ID} AND PL.PRODUCT_ID NOT IN (SELECT SP.PRO_ID FROM STORE_PRODUCTS SP)`
    );

const selectCategoryWithStoreLength = () =>
    ExecuteIT(
        "SELECT distinct(C.CAT_ID), C.CATEGORYBN, C.CATEGORYEN, COUNT(P.PROID) OVER(PARTITION BY P.PROCATE) AS PRODUCTS FROM STR_CATEGORIES C LEFT OUTER JOIN STR_STOREPRODUCTS P ON C.CAT_ID = P.PROCATE ORDER BY CAT_ID DESC"
    );










/*------------- INSERT ------------*/
// Product Entries
const insertMrrLogs = (
    {
        mrr_no,
        supplier_id,
        suppdate,
        workorder,
        cashmemono,
        cashmemodate,
        user_id
    }
) =>
    ExecuteIT(
        `INSERT INTO MRRLOGS (MRR_NO, SUP_ID, SUPP_DATE, WORK_ORDER, CASHMEMO_NO, CASHMEMO_DATE, ENTRY_BY) VALUES (${Number(
            mrr_no
        )}, ${Number(
            supplier_id
        )}, TO_DATE('${suppdate}', 'YYYY-MM-DD'), '${workorder}', '${cashmemono}', TO_DATE('${cashmemodate}', 'YYYY-MM-DD'), ${Number(user_id)}) RETURN MRR_LOG_ID INTO :id`,
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

const insertManyInd_Product = (array) => {
    let newArray = array;
    const statement = `INSERT INTO IND_PRODUCT (STR_PRO_ID, STATUS) VALUES (:STR_PRO_ID, :STATUS)`;
    return ExecuteITMany(statement, newArray);
};



// Product Entries Lists
const insertProductEntryLists = (
    { qty, price, store_pro_id },
    mrr_id,
    supplier_id
) =>
    ExecuteIT(
        `INSERT INTO PRODUCT_ENTRY_LIST (MRR_ID, SUP_ID, STR_PRO_ID, QUANTITES, AMOUNT) VALUES (${Number(
            mrr_id
        )}, ${Number(supplier_id)}, ${Number(store_pro_id)}, ${Number(qty)}, ${Number(
            price
        )}) RETURN PRO_EN_L_ID INTO :id`,
        { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );

const insertProdSummaries = (
    { qty, price },
    store_pro_id
) =>
    ExecuteIT(
        `INSERT INTO PRODUCT_SUMMARIES (STR_PRO_ID, NEWADD_QTY, CURRENT_PRICE, SUM_TYPE, PRESENT_QTY) VALUES (${Number(
            store_pro_id
        )}, ${Number(qty)}, ${Number(
            price
        )}, 'In',  ${Number(qty)}) RETURN SUMMARY_ID INTO :id`,
        { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );
const insertExProdSummaries = (
    totalQuantities,
    { qty, price, store_pro_id }
) =>
    ExecuteIT(
        `INSERT INTO PRODUCT_SUMMARIES (STR_PRO_ID, INITIAL_QTY, NEWADD_QTY, CURRENT_PRICE, SUM_TYPE, PRESENT_QTY) VALUES (${Number(
            store_pro_id
        )}, ${Number(totalQuantities)} - ${Number(qty)}, ${Number(qty)}, ${Number(
            price
        )}, 'In',  ${Number(totalQuantities)}) RETURN SUMMARY_ID INTO :id`,
        { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );

// 

/*------------ UPDATE ------------*/

const updateStoreProduct = ({ str_pro_id, qty, price }) =>
    ExecuteIT(
        `UPDATE STORE_PRODUCTS SET QUANTITY = QUANTITY + ${Number(
            qty
        )}, PRICE = ${Number(price)} WHERE STR_PRO_ID = ${Number(str_pro_id)} RETURN QUANTITY INTO :storeQuantity`,
        { storeQuantity: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );


module.exports = {
    selectNewProductListByCatId, selectCategoryWithStoreLength,
    insertMrrLogs, insertStoreProduct, insertManyInd_Product, insertProductEntryLists, insertProdSummaries,
    updateStoreProduct,
    insertExProdSummaries,

}