const { Execute } = require('../../../utils/dynamicController');


/*-------------------------------- SELECT --------------------------------*/

const getAllEntriesReports = (fdate, tdate) => Execute(`SELECT  LT.PROLISTID, LT.PRODATE, LT.MRRNUMBER, S.SUPPLIER, CT.CATEGORYEN, LT.QUANTITIES, LT.PROAMOUNT, LT.PROAMOUNT * LT.QUANTITIES as TOTALAMOUNT, U.UNIT FROM STR_PRODUCTENTRILISTS LT  LEFT OUTER JOIN STR_SUPPLIERS S ON LT.PRODUCTFROM = S.SUP_ID LEFT OUTER JOIN STR_STOREPRODUCTS ST ON ST.PROID = LT.PRODUCTIDNO LEFT OUTER JOIN STR_CATEGORIES CT ON CT.CAT_ID = ST.PROCATE LEFT OUTER JOIN STR_UNITS U ON ST.PRODUNIT = U.UNIT_ID WHERE LT.PRODATE >= '${fdate}' AND LT.PRODATE <= '${tdate}'`);


const getSingleEntriesReports = (productidno, fdate, tdate) => Execute(`SELECT  LT.PROLISTID, LT.PRODATE, LT.MRRNUMBER, S.SUPPLIER, CT.CATEGORYEN, LT.QUANTITIES, LT.PROAMOUNT, LT.PROAMOUNT * LT.QUANTITIES as TOTALAMOUNT, U.UNIT FROM STR_PRODUCTENTRILISTS LT  LEFT OUTER JOIN STR_SUPPLIERS S ON LT.PRODUCTFROM = S.SUP_ID LEFT OUTER JOIN STR_STOREPRODUCTS ST ON ST.PROID = LT.PRODUCTIDNO LEFT OUTER JOIN STR_CATEGORIES CT ON CT.CAT_ID = ST.PROCATE LEFT OUTER JOIN STR_UNITS U ON ST.PRODUNIT = U.UNIT_ID WHERE LT.PRODATE >= '${fdate}' AND LT.PRODATE <= '${tdate}' AND PRODUCTIDNO = ${Number(productidno)}`);


const stockStatus = () => Execute(`SELECT SP.PROID, SP.PRONAME, SP.PRONAMETWO, SP.PROQTY, C.CATEGORYEN FROM STR_STOREPRODUCTS SP LEFT OUTER JOIN STR_CATEGORIES C ON SP.PROCATE = C.CAT_ID ORDER BY PROID ASC`);


// $productsummaries = DB::table('productsummaries')->leftJoin('profiles', 'productsummaries.requisitionfor', '=', 'profiles.profid')->orderBy('prosumid', 'asc')->where('productid', $product)->get();
const getProductSummariesByProductid = 0;



/*--------------------------------END SELECT --------------------------------*/







module.exports = {
    getAllEntriesReports,
    getSingleEntriesReports,
    stockStatus
}