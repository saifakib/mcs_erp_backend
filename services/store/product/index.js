const { oracledb } = require("../../../db/db");
const { Execute, Executee } = require("../../../utils/dynamicController");

/*------------------------------------------ SELECT ------------------------------------------*/

// const getProducts = () =>
//   Execute("SELECT * FROM STR_STOREPRODUCTS ORDER BY proid ASC");
const getStoreProducts = (search = "%%", page = 0, limit = 1000) => {
  let offset = limit * page;
  return Execute(
    `SELECT PL.PROID, PL.PRONAME, PL.PRONAMETWO, PL.PROCATE, PL.PRODUNIT, C.CATEGORYBN, C.CATEGORYEN, U.UNIT, PL.PROTSTATUS , PL.PROQTY, PL.PROIMAGE
    FROM STR_STOREPRODUCTS PL 
    LEFT OUTER JOIN STR_CATEGORIES C ON C.CAT_ID = PL.PROCATE 
    LEFT OUTER JOIN STR_UNITS U ON U.UNIT_ID = PL.PRODUNIT WHERE LOWER(PL.PRONAME) LIKE LOWER('${search}') OR LOWER(C.CATEGORYEN) LIKE LOWER('${search}') OR LOWER(C.CATEGORYBN) LIKE LOWER('${search}') OR LOWER(U.UNIT) LIKE LOWER('${search}') OR LOWER(PL.PRONAMETWO) LIKE LOWER('${search}') OR LOWER(PL.PROQTY) LIKE LOWER('${search}') ORDER BY PROID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
  );
};

const getStoreProductsFR = (search = "%%", page = 0, limit = 1000, empid) => {
  let offset = limit * page;
  return Execute(
    `SELECT PL.PROID, PL.PRONAME, PL.PRONAMETWO, PL.PROCATE, PL.PRODUNIT, C.CATEGORYBN, C.CATEGORYEN, U.UNIT, PL.PROTSTATUS , PL.PROQTY
    FROM STR_STOREPRODUCTS PL 
    LEFT OUTER JOIN STR_CATEGORIES C ON C.CAT_ID = PL.PROCATE 
    LEFT OUTER JOIN STR_UNITS U ON U.UNIT_ID = PL.PRODUNIT 
    WHERE PL.PROQTY != ${Number(0)} AND PL.PROID NOT IN (SELECT AC.PROID FROM STR_ACCESS_PRODUCTS AC WHERE AC.EMP_ID = ${Number(empid)}) AND (LOWER(PL.PRONAME) LIKE LOWER('${search}') OR LOWER(C.CATEGORYEN) LIKE LOWER('${search}') OR LOWER(C.CATEGORYBN) LIKE LOWER('${search}') OR LOWER(U.UNIT) LIKE LOWER('${search}') OR LOWER(PL.PRONAMETWO) LIKE LOWER('${search}') OR LOWER(PL.PROQTY) LIKE LOWER('${search}')) ORDER BY PROID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
  );
};

const selectProdFromStore = (list_id) =>
  Execute(`SELECT PRONAME, PROCATE, PROID, PROQTY, STOCKPRICE, STOCKALERT, U.UNIT FROM STR_STOREPRODUCTS SP LEFT OUTER JOIN STR_UNITS U ON SP.PRODUNIT = U.UNIT_ID WHERE PRODLISTID=${Number(list_id)}`);

const selectProdFromStoreid = (PROID) =>
  Execute(`SELECT PRONAME, PROCATE, PROID, PROQTY, STOCKPRICE, STOCKALERT, U.UNIT FROM STR_STOREPRODUCTS SP LEFT OUTER JOIN STR_UNITS U ON SP.PRODUNIT = U.UNIT_ID WHERE PROID=${Number(PROID)}`);


const getTotalStoreProducts = () =>
  Execute("SELECT COUNT(PROID) as TOTAL_PRODUCT FROM STR_STOREPRODUCTS");

const totalQuantites = () =>
  Execute("SELECT COUNT(PROQTY) FROM STR_STOREPRODUCTS");

const getTotalEntQuantites = () =>
  Execute("SELECT SUM(QUANTITIES) AS TOTAL_QUANTITIES FROM STR_PRODUCTENTRILISTS");


const getTotalStoreProdQty = () =>
  Execute(
    "SELECT COUNT(PROID) AS Product, SUM(PROQTY) AS Quentity FROM STR_STOREPRODUCTS"
  );

const totalQuantitesByCategoryId = (CAT_ID) =>
  Execute(
    `SELECT SUM(SP.PROQTY), C.CATEGORYEN, C.CATEGORYBN 
    FROM STR_STOREPRODUCTS SP 
    LEFT OUTER JOIN STR_CATEGORIES C 
    ON SP.PROCATE = C.CAT_ID
    WHERE SP.PROCATE=${CAT_ID}
    GROUP BY C.CATEGORYEN, C.CATEGORYBN`
  );

const getProducListById = (PROD_ID) =>
  Execute(`SELECT * FROM STR_PRODUCTLISTS where prodid=${PROD_ID}`);

const getStoreProductByCategoryId = (
  CAT_ID,
  search = "%%",
  page = 0,
  limit = 1000
) => {
  let offset = limit * page;
  return Execute(
    `SELECT * FROM STR_STOREPRODUCTS SP LEFT OUTER JOIN STR_UNITS U ON SP.PRODUNIT = U.UNIT_ID where procate=${CAT_ID} AND LOWER(PRONAME || PRONAMETWO) LIKE LOWER('${search}') ORDER BY PROID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
  );
};

const getProducListByCategoryId = (CAT_ID) =>
  Execute(`SELECT * FROM STR_PRODUCTLISTS WHERE procate=${CAT_ID}`);

// product category with Store Product length
const getCategoryWithStoreLength = () =>
  Execute(
    "SELECT distinct(C.CAT_ID), C.CATEGORYBN, C.CATEGORYEN, COUNT(P.PROID) OVER(PARTITION BY P.PROCATE) AS PRODUCTS FROM STR_CATEGORIES C LEFT OUTER JOIN STR_STOREPRODUCTS P ON C.CAT_ID = P.PROCATE ORDER BY CAT_ID DESC"
  );

//Get Product Info from StoreProduct by productlistId
const getStoreProductByProdListId = (PROD_ID) =>
  Execute(`SELECT * FROM STR_STOREPRODUCTS where prodlistid=${PROD_ID}`);

const getExStoreProductByProdListId = (PROID) =>
  Execute(
    `SELECT PROID, PRONAME, PRONAMETWO, PROCATE, CATEGORYEN, CATEGORYBN, PRODUNIT, PROQTY, STOCKPRICE, STOCKALERT, UNIT, PROIMAGE, PROTSTATUS, PRODLISTID AS PROD_LIST_ID from STR_STOREPRODUCTS S left outer join STR_UNITS U on S.PRODUNIT = U.UNIT_ID left outer join STR_CATEGORIES C ON S.PROCATE = C.CAT_ID where proid = ${PROID}`
  );

const getLastMrrNumber = () =>
  Execute(`SELECT MAX(MRRNNO) AS MRRNO FROM STR_PRODUCTENTRIES`);

const getNewProductList = (CAT_ID) =>
  Execute(
    `SELECT * FROM STR_PRODUCTLISTS PL WHERE PL.PROCATE = ${CAT_ID} AND PL.PRODID NOT IN (SELECT SP.PRODLISTID FROM STR_STOREPRODUCTS SP)`
  );

const getSingleEntrylistByPrdId = (prodid, mrrno) => Execute(`SELECT PROLISTID FROM STR_PRODUCTENTRILISTS WHERE MRRNUMBER=${Number(mrrno)} AND PRODUCTIDNO=${Number(prodid)}`);

/*------------------------------------------ END SELECT ------------------------------------------*/




/*------------------------------------------  INSERT ------------------------------------------*/
// Product Entries
const postProductEntries = (
  {mrrnno, supplier, suppdate, workorder,
    workodate,
    cashmemono,
    cashmemodate,
    username,
  },
  entridate,
  entritime,
  entrimonth
) =>
  Execute(
    `INSERT INTO STR_PRODUCTENTRIES (mrrnno, supplier, suppdate, workorder, workodate, cashmemono, cashmemodate, entritime, entridate, entrimonth, entryby) VALUES (${Number(
      mrrnno
    )}, ${Number(
      supplier
    )}, '${suppdate}', '${workorder}', '${workodate}', '${cashmemono}', '${cashmemodate}', '${entritime}', '${entridate}', '${entrimonth}', '${username}') RETURN proinid INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

// Store Product
const postStoreProduct = ({ proname, pro_name_two, prod_list_id, qty, price, category, prod_unit, stock_alert }) =>
  Executee(
    `INSERT INTO STR_STOREPRODUCTS (proname, pronametwo, proqty, stockprice, procate, produnit, stockalert, prodlistid) VALUES ('${proname}', '${pro_name_two}', ${Number(
      qty
    )}, ${Number(price)}, ${Number(category)}, ${Number(prod_unit)}, ${Number(
      stock_alert
    )}, ${Number(prod_list_id)}) RETURN proid INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }, 1
  );

// Product Entries Lists
const postProductEntriesLists = (
  { qty, price }, mrrnno, supplier, storeproid, entridate, entrimonth, username) =>
  Execute(
    `INSERT INTO STR_PRODUCTENTRILISTS (mrrnumber, productfrom, productidno, quantities, proamount, prodate, promonth, prodentryby) VALUES (${Number(
      mrrnno
    )}, ${Number(supplier)}, ${Number(storeproid)}, ${Number(qty)}, ${Number(
      price
    )}, '${entridate}', '${entrimonth}', '${username}') RETURN prolistid INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

// Product Summaries
const postProductSummaries = (
  initialQuantities,
  { qty, price, category, proname },
  storeproid,
  summdate,
  entrimonth
) => Execute(
  `INSERT INTO STR_PRODUCTSUMMARIES (productid, PRODUCTNAME, INTIALQTY, newaddqty, totalbalance, presentbalance, currentprice, summdate, summmonth, summertype, procat) VALUES (${Number(
    storeproid
  )}, '${proname}', ${Number(initialQuantities)}, ${Number(qty)}, ${Number(initialQuantities) + Number(qty)}, ${Number(initialQuantities) + Number(qty)}, ${Number(
    price
  )}, '${summdate}', '${entrimonth}', 'In', ${Number(
    category
  )}) RETURN prosumid INTO :id`,
  { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
);


const postProductSummariesEntry = (
  { qty, price, category, proname },
  storeproid,
  summdate,
  entrimonth
) =>
  Execute(
    `INSERT INTO STR_PRODUCTSUMMARIES (productid, PRODUCTNAME, INTIALQTY, newaddqty, totalbalance, presentbalance, currentprice, summdate, summmonth, summertype, procat) VALUES (${Number(
      storeproid
    )}, '${proname}', ${Number(qty)}, ${Number(qty)}, ${Number(qty)},  ${Number(qty)}, ${Number(
      price
    )}, '${summdate}', '${entrimonth}', 'In', ${Number(
      category
    )}) RETURN prosumid INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

/*------------------------------------------ END INSERT ------------------------------------------*/





/*------------------------------------------  UPDATE ------------------------------------------*/

const updateStoreProduct = ({ proid, qty, price }) =>
  Execute(
    `UPDATE STR_STOREPRODUCTS SET proqty = proqty + ${Number(
      qty
    )}, stockprice = ${Number(price)} WHERE proid = ${proid} RETURN proqty INTO :storeQuantity`,
    { storeQuantity: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

const updateStoreProductM = (proid, proname, pro_name_two, procate, prounit, stockalert, proqty, stockprice, status, proimage) =>
  Execute(
    `UPDATE STR_STOREPRODUCTS SET proname = '${proname}', pronametwo='${pro_name_two}', procate = ${Number(
      procate
    )}, produnit = ${Number(prounit)}, protstatus = ${Number(
      status
    )}, proqty = ${Number(proqty)}, stockprice = ${Number(stockprice)}, STOCKALERT = ${Number(stockalert)}, PROIMAGE = '${proimage}' WHERE proid = ${Number(proid)}`
  );


const updateSingleEntrylistByPrdId = (prodid, mrrno, newqty, newPrice) => Execute(`UPDATE STR_PRODUCTENTRILISTS SET QUANTITIES = QUANTITIES + ${Number(newqty)}, PROAMOUNT = ${Number(newPrice)} WHERE MRRNUMBER=${Number(mrrno)} AND PRODUCTIDNO=${Number(prodid)}`);

/*------------------------------------------ END UPDATE ------------------------------------------*/






/*------------------------------------------ DELETE ------------------------------------------*/

const deleteDynamically = (
  tableName, colomName, id
) =>
  Execute(
    `DELETE FROM ${tableName} WHERE ${colomName} = ${id}`
  );

/*------------------------------------------ END DELETE ------------------------------------------*/

module.exports = {
  getStoreProducts, getStoreProductsFR, selectProdFromStore, totalQuantites, getTotalEntQuantites, totalQuantitesByCategoryId, getProducListById, selectProdFromStoreid, getTotalStoreProducts, getStoreProductByProdListId, getStoreProductByCategoryId, getProducListByCategoryId, getLastMrrNumber, getCategoryWithStoreLength, getTotalStoreProdQty, getExStoreProductByProdListId, getSingleEntrylistByPrdId, getNewProductList,
  postProductEntries, postStoreProduct, postProductSummariesEntry, postProductEntriesLists, postProductSummaries,
  updateStoreProduct, updateSingleEntrylistByPrdId, updateStoreProductM,
  deleteDynamically
};
