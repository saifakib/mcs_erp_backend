const { ExecuteIT, ExecuteITMany } = require("../../../utils/itDynamicController");
const { oracledb } = require("../../../db/db");

/*------------- SELECT ------------*/
const selectNewProductListByCatId = (CAT_ID) =>
    ExecuteIT(
        `SELECT * FROM PRODUCT_LIST PL WHERE PL.CATEGORY_ID = ${CAT_ID} AND PL.PRODUCT_ID NOT IN (SELECT SP.PRO_ID FROM STORE_PRODUCTS SP)`
    );


const selectCategoryWithStore = () =>
    ExecuteIT(
        `WITH CATEGORY AS (			
        SELECT  		
          DISTINCT CATEGORY_NAME, C.CATEGORY_ID,
          COUNT (PL.PRODUCT_ID) OVER (PARTITION BY C.CATEGORY_NAME) CT,
          SUM(QUANTITY)  OVER (PARTITION BY PL.CATEGORY_ID),
          SUM(NON_WORKABLE)  OVER (PARTITION BY PL.CATEGORY_ID)
        FROM  STORE_PRODUCTS sp left outer join PRODUCT_LIST PL
          ON PL.PRODUCT_ID = SP.PRO_ID
          LEFT OUTER JOIN CATEGORIES C
          ON C.CATEGORY_ID = PL.CATEGORY_ID		
        )			
        SELECT * FROM CATEGORY`
    );

const selectStrProductsByCatId = (category_id) =>
    ExecuteIT(`SELECT SP.STR_PRO_ID, PL.PRODUCT_ID, PL.PRODUCT_NAME, M.MODEL_NAME, U.UNIT_NAME, B.BRAND_NAME, 
    SP.PRICE, SP.STOCK_ALERT, SP.QUANTITY, SP.NON_WORKABLE, SP.STOCK_ALERT, C.CATEGORY_NAME, C.CATEGORY_ID FROM STORE_PRODUCTS SP 
    LEFT OUTER JOIN PRODUCT_LIST PL ON SP.PRO_ID = PL.PRODUCT_ID
    LEFT OUTER JOIN CATEGORIES C ON PL.CATEGORY_ID = C.CATEGORY_ID
    LEFT OUTER JOIN MODELS M ON SP.MODEL_ID = M.MODEL_ID
    LEFT OUTER JOIN UNIT U ON SP.UNIT_ID = U.UNIT_ID
    LEFT OUTER JOIN BRAND B ON SP.BRAND_ID = B.BRAND_ID
    WHERE PL.CATEGORY_ID=${Number(category_id)}`);


const selectStoreProducts = () => ExecuteIT(`SELECT SP.STR_PRO_ID, PL.PRODUCT_NAME, M.MODEL_NAME, U.UNIT_NAME, B.BRAND_NAME, 
    SP.PRICE, SP.STOCK_ALERT, SP.QUANTITY, SP.NON_WORKABLE, SP.STOCK_ALERT FROM STORE_PRODUCTS SP 
    LEFT OUTER JOIN PRODUCT_LIST PL ON SP.PRO_ID = PL.PRODUCT_ID
    LEFT OUTER JOIN MODELS M ON SP.MODEL_ID = M.MODEL_ID
    LEFT OUTER JOIN UNIT U ON SP.UNIT_ID = U.UNIT_ID
    LEFT OUTER JOIN BRAND B ON SP.BRAND_ID = B.BRAND_ID`);


const selectStoreProductsById = (str_pro_id) => ExecuteIT(`SELECT SP.STR_PRO_ID, PL.PRODUCT_NAME, M.MODEL_NAME, U.UNIT_NAME, B.BRAND_NAME, 
    SP.PRICE, SP.STOCK_ALERT, SP.QUANTITY, SP.NON_WORKABLE, SP.STOCK_ALERT FROM STORE_PRODUCTS SP 
    LEFT OUTER JOIN PRODUCT_LIST PL ON SP.PRO_ID = PL.PRODUCT_ID
    LEFT OUTER JOIN MODELS M ON SP.MODEL_ID = M.MODEL_ID
    LEFT OUTER JOIN UNIT U ON SP.UNIT_ID = U.UNIT_ID
    LEFT OUTER JOIN BRAND B ON SP.BRAND_ID = B.BRAND_ID WHERE SP.STR_PRO_ID = ${Number(str_pro_id)}`);

const selectProductWithSup = (product_id) => ExecuteIT(`SELECT DISTINCT S.SUP_NAME, PL.PRODUCT_NAME, TO_CHAR(PEL.ENTRY_DATE, 'DD-MM-YYYY') AS STR_DATE, COUNT(IND_PRODUCT_ID) OVER(PARTITION BY  S.SUP_NAME) AS TOTAL_QTY
FROM IND_PRODUCT IP LEFT OUTER JOIN STORE_PRODUCTS SP  ON  SP.STR_PRO_ID = IP.STR_PRO_ID
LEFT OUTER  JOIN PRODUCT_LIST PL ON PL.PRODUCT_ID = SP.PRO_ID
LEFT OUTER JOIN PRODUCT_ENTRY_LIST PEL ON PEL.STR_PRO_ID = SP.STR_PRO_ID
LEFT OUTER JOIN SUPPLIERS S ON S.SUPPLIER_ID = PEL.SUP_ID
where PL.PRODUCT_ID = ${Number(product_id)} ORDER BY  S.SUP_NAME`);



const selectLastMrrNumber = () =>
    ExecuteIT(`SELECT MAX(MRR_NO) AS MRRNO FROM MRRLOGS`);


    

/*------------- INSERT ------------*/
// Product Entries
const insertMrrLogs = (
    {
        mrr_no,
        supplier_id,
        suppdate,
        workorder,
        workorderdate,
        cashmemono,
        cashmemodate,
        user_id
    }
) =>
    ExecuteIT(
        `INSERT INTO MRRLOGS (MRR_NO, SUP_ID, SUPP_DATE, WORK_ORDER, CASHMEMO_NO, CASHMEMO_DATE, ENTRY_BY, WORK_ORDER_DATE) VALUES (${Number(
            mrr_no
        )}, ${Number(
            supplier_id
        )}, TO_DATE('${suppdate}', 'YYYY-MM-DD'), '${workorder}', '${cashmemono}', TO_DATE('${cashmemodate}', 'YYYY-MM-DD'), ${Number(user_id)}, TO_DATE('${workorderdate}', 'YYYY-MM-DD')) RETURN MRR_LOG_ID INTO :id`,
        { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );


// Store Product
const insertStoreProduct = ({
    model_id,
    pro_id,
    brand_id,
    unit_id,
    qty,
    non_workable,
    price,
    stock_alert,
    remarks
}) =>
    ExecuteIT(
        `INSERT INTO STORE_PRODUCTS (MODEL_ID, PRO_ID, BRAND_ID, UNIT_ID, QUANTITY, NON_WORKABLE, PRICE, STOCK_ALERT, REMARKS) VALUES (${Number(model_id)}, ${Number(pro_id)}, ${Number(
            brand_id
        )}, ${Number(unit_id)}, ${Number(qty)}, ${Number(non_workable)}, ${Number(price)}, ${Number(
            stock_alert
        )}, '${remarks}') RETURN STR_PRO_ID INTO :id`,
        { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );

const insertManyInd_Product = (array) => {
    let newArray = array;
    const statement = `INSERT INTO IND_PRODUCT (STR_PRO_ID, STATUS, UNIQUE_V, PRICE) VALUES (:STR_PRO_ID, :STATUS, :UNIQUE_V, :PRICE)`;
    return ExecuteITMany(statement, newArray);
};



// Product Entries Lists
const insertProductEntryLists = (
    { qty, price, store_pro_id, pro_id },
    mrr_id,
    supplier_id
) =>
    ExecuteIT(
        `INSERT INTO PRODUCT_ENTRY_LIST (MRR_ID, SUP_ID, PRO_ID, STR_PRO_ID, QUANTITES, AMOUNT) VALUES (${Number(
            mrr_id
        )}, ${Number(supplier_id)}, ${Number(pro_id)}, ${Number(store_pro_id)}, ${Number(qty)}, ${Number(
            price
        )}) RETURN PRO_EN_L_ID INTO :id`,
        { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );

const insertProdSummaries = (
    { qty, price, pro_id },
    store_pro_id
) =>
    ExecuteIT(
        `INSERT INTO PRODUCT_SUMMARIES (STR_PRO_ID, NEWADD_QTY, CURRENT_PRICE, SUM_TYPE, PRESENT_QTY, PRO_ID) VALUES (${Number(
            store_pro_id
        )}, ${Number(qty)}, ${Number(
            price
        )}, 'In',  ${Number(qty)}, ${Number(pro_id)}) RETURN SUMMARY_ID INTO :id`,
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

const updateStoreProduct = ({ str_pro_id, qty, price }, stock_alert = false, stock_alert_number) =>
    stock_alert ? ExecuteIT(
        `UPDATE STORE_PRODUCTS SET QUANTITY = ${Number(
            qty
        )}, PRICE = ${Number(price)}, STOCK_ALERT = ${Number(stock_alert_number)} WHERE STR_PRO_ID = ${Number(str_pro_id)} RETURN QUANTITY INTO :storeQuantity`,
        { storeQuantity: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    ) : ExecuteIT(
        `UPDATE STORE_PRODUCTS SET QUANTITY = QUANTITY + ${Number(
            qty
        )}, PRICE = ${Number(price)}, NON_WORKABLE = NON_WORKABLE + ${Number(non_workable)} WHERE STR_PRO_ID = ${Number(str_pro_id)} RETURN QUANTITY INTO :storeQuantity`,
        { storeQuantity: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
    );




module.exports = {
    selectLastMrrNumber,
    selectStoreProducts, selectStoreProductsById,
    selectNewProductListByCatId, selectStrProductsByCatId, selectCategoryWithStore,
    selectProductWithSup,
    insertMrrLogs, insertStoreProduct, insertManyInd_Product, insertProductEntryLists, insertProdSummaries,
    updateStoreProduct,
    insertExProdSummaries,

}