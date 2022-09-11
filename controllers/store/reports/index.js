const { createResponse } = require("../../../utils/responseGenerator");
const { getAllEntriesReports, getSingleEntriesReports, stockStatus, getProductSummariesByProductid, getProductSummariesBySummMonth, getProductSummariesBySummMonthAndCatId } = require("../../../services/store/reports");


/**
 * Report - Product Entries All & Single 
 */
const entriesProductReport = async (req, res, next) => {
    const { queryFor, productidno, fdate, tdate } = req.query;
    try {
        if(queryFor == 'all') {
            if(!fdate || !tdate) {
                res.json(createResponse(null, "Required query missing", true));
            } 
            else {
                const response = await getAllEntriesReports(fdate, tdate);

                const Total = response.rows.reduce((acc, obj) => {
                    acc[0] += obj.QUANTITIES
                    acc[1] += obj.TOTALAMOUNT;
                    return acc;
                }, [0,0])
    
                res.json(createResponse({
                    products: response.rows,
                    totalProduct: response.rows.length,
                    TotalListQuantities: Total[0],
                    TotalListAmount: Total[1]
                }));
            }
        } 
        else if(queryFor == 'single') {
            if(!productidno || !fdate || !tdate) {
                res.json(createResponse(null, "Required query missing", true));
            } 
            else {
                const response = await getSingleEntriesReports(productidno, fdate, tdate);

                const Total = response.rows.reduce((acc, obj) => {
                    acc[0] += obj.QUANTITIES
                    acc[1] += obj.TOTALAMOUNT;
                    return acc;
                }, [0,0])

                res.json(createResponse({
                    products: response.rows,
                    totalProduct: response.rows.length,
                    TotalListQuantities: Total[0],
                    TotalListAmount: Total[1]
                }));
            }
        } else {
            res.json(createResponse(null, "Invalid Query For", true));
        }
    } catch(err) {
        next(err)
    }
}

/**
 * Report - Stock Status 
 */
const productStockStatus = async (_, res, next) => {
    try {
        const response = await stockStatus();
        res.json(createResponse(response.rows));
    } catch(err) {
        next(err)
    }
}


/**
 * Report - Logs
 */
const productLogs = async (req, res, next) => {
    const { queryFor, proid, month, year, categoryid } = req.query;
    try{
        if(queryFor == 'product') {
            if(!proid) {
                res.json(createResponse(null, "Required query missing", true));
            }
            else {
                const productSummaries = await getProductSummariesByProductid(proid);
                
                let total = productSummaries.rows.reduce((acc, obj) => {
                    acc[0] += obj.NEWADDQTY;
                    acc[1] += obj.TOTALOUT;
                    return acc;
                }, [0,0]);

                res.json(createResponse({
                    productSummaries: productSummaries.rows,
                    totalIn: total[0],
                    totalOut: total[1]
                }));
                
            }
        } 
        else if(queryFor == 'month') {
            if(!month || !year) {
                res.json(createResponse(null, "Required query missing", true));
            } 
            else {
                const summMonth = `'${month}-${year}'`;
                const productSummaries = await getProductSummariesBySummMonth(summMonth);

                let total = productSummaries.rows.reduce((acc, obj) => {
                    acc[0] += obj.NEWADDQTY;
                    acc[1] += obj.TOTALOUT;
                    return acc;
                }, [0,0]);

                res.json(createResponse({
                    productSummaries: productSummaries.rows,
                    totalIn: total[0],
                    totalOut: total[1]
                }));
            }
        }
        else if(queryFor == 'category') {
            if(!categoryid || !month || !year) {
                res.json(createResponse(null, "Required query missing", true));
            } 
            else {
                const summMonth = `'${month}-${year}'`;
                const productSummaries = await getProductSummariesBySummMonthAndCatId(summMonth, categoryid);

                let total = productSummaries.rows.reduce((acc, obj) => {
                    acc[0] += obj.NEWADDQTY;
                    acc[1] += obj.TOTALOUT;
                    return acc;
                }, [0,0]);

                res.json(createResponse({
                    productSummaries: productSummaries.rows,
                    totalIn: total[0],
                    totalOut: total[1]
                }));
            }
        }
        else {
            res.json(createResponse(null, "Invalid Query For", true));
        }
    } catch(err) {
        next(err)
    }
}

module.exports = {
    entriesProductReport,
    productStockStatus,
    productLogs
}