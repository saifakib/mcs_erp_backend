const { oracledb } = require("../../../db/db");
const { Execute } = require("../../../utils/dynamicController");

/*------------- Get ------------*/

// const getProducts = () =>
//   Execute("SELECT * FROM STR_STOREPRODUCTS ORDER BY proid ASC");
const getStoreProducts = (search = "%%", page = 0, limit = 1000) => {
  let offset = limit * page;
  return Execute(
    `SELECT PL.PROID, PL.PRONAME, PL.PRONAMETWO, PL.PROCATE, PL.PRODUNIT, C.CATEGORYBN, C.CATEGORYEN, U.UNIT
    FROM STR_STOREPRODUCTS PL 
    LEFT OUTER JOIN STR_CATEGORIES C ON C.CAT_ID = PL.PROCATE 
    LEFT OUTER JOIN STR_UNITS U ON U.UNIT_ID = PL.PRODUNIT WHERE LOWER(PRONAME) LIKE LOWER('${search}') OR LOWER(C.CATEGORYEN) LIKE LOWER('${search}') ORDER BY PROID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
  );
};
const getTotalStoreProducts = () =>
  Execute("SELECT COUNT(PROID) FROM STR_STOREPRODUCTS");
const totalQuantites = () =>
  Execute("SELECT COUNT(PROQTY) FROM STR_STOREPRODUCTS");
const getTotalStoreProdQty = () =>
  Execute(
    "SELECT COUNT(PROID) AS Product, SUM(PROQTY) AS Quentity FROM STR_STOREPRODUCTS"
  );
const totalQuantitesByCategoryId = (CAT_ID) =>
  Execute(
    `SELECT SUM(proqty) FROM STR_PRODUCTENTRILISTS WHERE procate=${CAT_ID}`
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
    `SELECT * FROM STR_STOREPRODUCTS where procate=${CAT_ID} AND LOWER(PRONAME || PRONAMETWO) LIKE LOWER('${search}') ORDER BY PROID DESC OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
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
    `SELECT PROID, PRONAME, PRONAMETWO, PROCATE, PRODUNIT, PROQTY, STOCKPRICE, UNIT from STR_STOREPRODUCTS S left outer join STR_UNITS U on S.PRODUNIT = U.UNIT_ID where proid = ${PROID}`
  );

const getLastMrrNumber = () =>
  Execute(`SELECT MAX(MRRNNO) AS MRRNO FROM STR_PRODUCTENTRIES`);

const getNewProductList = (CAT_ID) =>
  Execute(
    `SELECT * FROM STR_PRODUCTLISTS PL WHERE PL.PROCATE = ${CAT_ID} AND PL.PRODID NOT IN (SELECT SP.PRODLISTID FROM STR_STOREPRODUCTS SP)`
  );

/*-------------- Post -------------------*/

// Product Entries
const postProductEntries = (
  {
    mrrnno,
    supplier,
    suppdate,
    workorder,
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
const postStoreProduct = ({
  proname,
  pro_name_two,
  prod_list_id,
  qty,
  price,
  category,
  prod_unit,
  stock_alert,
}) =>
  Execute(
    `INSERT INTO STR_STOREPRODUCTS (proname, pronametwo, proqty, stockprice, procate, produnit, stockalert, prodlistid) VALUES ('${proname}', '${pro_name_two}', ${Number(
      qty
    )}, ${Number(price)}, ${Number(category)}, ${Number(prod_unit)}, ${Number(
      stock_alert
    )}, ${Number(prod_list_id)}) RETURN proid INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

// Product Entries Lists
const postProductEntriesLists = (
  { qty, price },
  mrrnno,
  supplier,
  storeproid,
  entridate,
  entrimonth,
  username
) =>
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
  { proname, pro_name_two, qty, price, category },
  storeproid,
  entridate,
  summdate,
  entrimonth
) =>
  Execute(
    `INSERT INTO STR_PRODUCTSUMMARIES (productid, productname, prodnametwo, newaddqty, totalbalance, presentbalance, currentprice, addtodate, summdate, summmonth, summertype, procat) VALUES (${Number(
      storeproid
    )}, '${proname}', '${pro_name_two}', ${Number(qty)}, ${Number(
      qty
    )}, ${Number(qty)}, ${Number(
      price
    )}, '${entridate}', '${summdate}', '${entrimonth}', 'In', ${Number(
      category
    )}) RETURN prosumid INTO :id`,
    { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } }
  );

/*--------------UPDATE-------------*/

const updateStoreProduct = ({ proid, qty, price }) =>
  Execute(
    `UPDATE STR_STOREPRODUCTS SET proqty = proqty + ${Number(
      qty
    )}, stockprice = ${Number(price)} WHERE proid = ${proid}`
  );

const updateStoreProductM = (
  proid,
  proname,
  pro_name_two,
  procate,
  prounit,
  status
) =>
  Execute(
    `UPDATE STR_STOREPRODUCTS SET proname = '${proname}', pronametwo='${pro_name_two}', procate = ${Number(
      procate
    )}, produnit = ${Number(prounit)}, protstatus = ${Number(
      status
    )} WHERE proid = ${Number(proid)}`
  );

const testProduct = () => {
  let date = new Date();
  let creatdate = date.toISOString().split("T")[0];
  let entritime = format(date, "hh:mm a");
  let entrimonth = format(date, "LLLL-yyyy");

  return console.log(entrimonth);
};

module.exports = {
  getStoreProducts,
  totalQuantites,
  totalQuantitesByCategoryId,
  getProducListById,
  getTotalStoreProducts,
  getStoreProductByProdListId,
  getStoreProductByCategoryId,
  getProducListByCategoryId,
  getLastMrrNumber,
  getCategoryWithStoreLength,
  getTotalStoreProdQty,
  getExStoreProductByProdListId,
  postProductEntries,
  postStoreProduct,
  updateStoreProduct,
  postProductEntriesLists,
  postProductSummaries,
  getNewProductList,
  updateStoreProductM,
};
