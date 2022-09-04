const { oracledb } = require('../../../db/db')
const { Execute } = require('../../../utils/dynamicController');


/*------------- Get ------------*/

// const getCategoryWithStoreLength = () =>
//   Execute(
//     "SELECT distinct(C.CAT_ID), C.CATEGORYBN, C.CATEGORYEN, COUNT(P.PROID) OVER(PARTITION BY P.PROCATE) AS PRODUCTS FROM STR_CATEGORIES C LEFT OUTER JOIN STR_STOREPRODUCTS P ON C.CAT_ID = P.PROCATE ORDER BY CAT_ID DESC"
//   );

const getSupplierWithProductEntriesInfo = () => Execute("SELECT DISTINCT(S.SUP_ID), S.SUPPLIER,  SUM(LT.QUANTITIES*PROAMOUNT) OVER(PARTITION BY LT.PRODUCTFROM) AS Total_Amount, SUM(QUANTITIES) OVER (PARTITION BY  LT.PRODUCTFROM) AS Total_quantity FROM STR_PRODUCTENTRILISTS LT LEFT OUTER JOIN STR_SUPPLIERS S ON LT.PRODUCTFROM = S.SUP_ID");

const getRecentMonthSupply = (month) => Execute(`SELECT * FROM STR_PRODUCTENTRIES PE LEFT OUTER JOIN STR_SUPPLIERS S ON PE.PRODUCTFROM = S.SUP_ID WHERE ENTRIMONTH = ${month} ORDER BY ENTRIDATE`)

// $month = date('F-Y');
//         $productentries = DB::table('productentrilists')
//                 ->leftJoin('suppliers', 'productentrilists.productfrom', '=', 'suppliers.sup_id')
//                 ->select('productfrom', 'supplier')
//                 ->selectRaw("SUM(quantities) as totalproqty")
//                 ->selectRaw("SUM(proamount) as totalprice")
//                 ->groupBy('productfrom', 'supplier')
//                 ->get();

//         $getrecentsupplier = DB::table('productentries')
//                 ->leftJoin('suppliers', 'productentries.supplier', '=', 'suppliers.sup_id')
//                 ->where('entrimonth', $month)
//                 ->orderBy('entridate')
//                 ->get();
//         $data = [
//             'getsupplier' => $productentries,
//             'getrecentsupplier' => $getrecentsupplier,
//         ];


module.exports = {
    getSupplierWithProductEntriesInfo,
    getRecentMonthSupply
}