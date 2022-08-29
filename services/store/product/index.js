const { oracledb } = require('../../../db/db')
const { Execute } = require('../../../utils/dynamicController');

/*------------- Get ------------*/

const getProducts = () => Execute("SELECT * FROM STR_STOREPRODUCTS ORDER BY proid ASC");
const totalQuantites = () => Execute("SELECT COUNT(proid) FROM STR_STOREPRODUCTS")
const totalQuantitesByCategoryId = (CAT_ID) => Execute(`SELECT SUM(proqty) FROM STR_PRODUCTENTRILISTS WHERE procate=${CAT_ID}`)
const getProducListById = (PROD_ID) => Execute(`SELECT * FROM STR_PRODUCTLISTS where prodid=${PROD_ID}`);
const getStoreProductByProdListId = (PROD_ID) => Execute(`SELECT * FROM STR_STOREPRODUCTS where prodlistid=${PROD_ID}`);
const getProducListByCategoryId = (CAT_ID) => Execute(`SELECT * FROM STR_PRODUCTLISTS WHERE procate=${CAT_ID}`)


/*-------------- Post -------------------*/

// Product Entries
const postProductEntries = ({ mrrnno, supplier, suppdate, workorder, workodate, cashmemono, cashmemodate, username }, entridate, entritime, entrimonth) => Execute(`INSERT INTO STR_PRODUCTENTRIES (mrrnno, supplier, suppdate, workorder, workodate, cashmemono, cashmemodate, entritime, entridate, entrimonth, entryby) VALUES (${Number(mrrnno)}, ${Number(supplier)}, '${suppdate}', '${workorder}', '${workodate}', '${cashmemono}', '${cashmemodate}', '${entritime}', '${entridate}', '${entrimonth}', '${username}') RETURN proinid INTO :id`, { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } })

// Store Product
const postStoreProduct = ({prod_list_id, qty, price, category, prod_unit, stock_alert }) => Execute(`INSERT INTO STR_STOREPRODUCTS (proqty, stockprice, procate, produnit, stockalert, prodlistid) VALUES (${Number(qty)}, ${Number(price)}, ${Number(category)}, ${Number(prod_unit)}, ${Number(stock_alert)}, ${Number(prod_list_id)}) RETURN proid INTO :id`, { id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } });

// Product Entries Lists
const postProductEntriesLists = ({ qty, price }, mrrnno, supplier, storeproid, entridate, entrimonth, username) => Execute(`INSERT INTO STR_PRODUCTENTRILISTS (mrrnumber, productfrom, productidno, quantities, proamount, prodate, promonth, prodentryby) VALUES (${Number(mrrnno)}, ${Number(supplier)}, ${Number(storeproid)}, ${Number(qty)}, ${Number(price)}, '${entridate}', '${entrimonth}', '${username}')`);


// Product Summaries
const postProductSummaries = ({ proname, pro_name_two, qty, price }, storeproid, entridate, summdate, entrimonth) => Execute(`INSERT INTO STR_PRODUCTSUMMARIES (productid, productname, prodnametwo, newaddqty, totalbalance, presentbalance, currentprice, addtodate, summdate, summmonth, summertype) VALUES (${Number(storeproid)}, '${proname}', '${pro_name_two}', ${Number(qty)}, ${Number(qty)}, ${Number(qty)}, ${Number(price)}, '${entridate}', '${summdate}', '${entrimonth}', 'In')`);


const testProduct = () => {
    let date = new Date();
    let creatdate = date.toISOString().split('T')[0];
    let entritime = format(date, 'hh:mm a');
    let entrimonth = format(date, 'LLLL-yyyy');

    return console.log(entrimonth)
}




module.exports = {
    getProducts,
    totalQuantites,
    totalQuantitesByCategoryId,
    getProducListById,
    getStoreProductByProdListId,
    getProducListByCategoryId,
    postProductEntries,
    postStoreProduct,
    postProductEntriesLists,
    postProductSummaries
}