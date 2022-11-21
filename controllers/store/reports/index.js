const { createResponse } = require("../../../utils/responseGenerator");
const { getAllEntriesReports, getSingleEntriesReports, stockStatus, stockStatusByCatId, getProductSummariesByProductid, getProductSummariesBySummMonth, getProductSummariesBySummMonthAndCatId, getProductSummariesByCatId, getRequisitionsByDate, getRequisitionsByProduct, getRequisitionsByProductAndDate, getRequisitionsByPerson, getRequisitionsByPersonAndDate, getUserReqReportByDate, getUserReqReportByMonth, getUserReqReportByYear, getUserSingleReqView } = require("../../../services/store/reports");
const { format } = require('date-fns')


/**
 * Report - Product Entries All & Single
 */
const entriesProductReport = async (req, res, next) => {
    const { queryFor, productidno, fdate, tdate } = req.query;
    try {
        if (queryFor == "all") {
            if (!fdate || !tdate) {
                res.json(createResponse(null, "Required query missing", true));
            } else {
                const response = await getAllEntriesReports(fdate, tdate);

                const Total = response.rows.reduce(
                    (acc, obj) => {
                        acc[0] += obj.QUANTITIES;
                        acc[1] += obj.TOTALAMOUNT;
                        return acc;
                    },
                    [0, 0]
                );

                res.json(
                    createResponse({
                        products: response.rows,
                        totalProduct: response.rows.length,
                        TotalListQuantities: Total[0],
                        TotalListAmount: Total[1],
                    })
                );
            }
        } else if (queryFor == "single") {
            if (!productidno || !fdate || !tdate) {
                res.json(createResponse(null, "Required query missing", true));
            } else {
                const response = await getSingleEntriesReports(
                    productidno,
                    fdate,
                    tdate
                );

                const Total = response.rows.reduce(
                    (acc, obj) => {
                        acc[0] += obj.QUANTITIES;
                        acc[1] += obj.TOTALAMOUNT;
                        return acc;
                    },
                    [0, 0]
                );

                res.json(
                    createResponse({
                        products: response.rows,
                        totalProduct: response.rows.length,
                        TotalListQuantities: Total[0],
                        TotalListAmount: Total[1],
                    })
                );
            }
        } else {
            res.json(createResponse(null, "Invalid Query For", true));
        }
    } catch (err) {
        next(err);
    }
};

/**
 * Report - Stock Status
 */

const productStockStatus = async (req, res, next) => {
    const { queryFor, categoryid } = req.query;
    try {
        if (queryFor == 'all') {
            const response = await stockStatus();
            res.json(createResponse(response.rows));
        }
        else if (queryFor == 'category') {
            if (!categoryid) {
                res.json(createResponse(null, "Required query missing", true));
            }
            else {
                const response = await stockStatusByCatId(categoryid);
                res.json(createResponse(response.rows));
            }
        }
        else {
            res.json(createResponse(null, "Invalid Query For", true));
        }

    } catch (err) {
        next(err)
    }
}

/**
 * Report - Logs
 */
const productLogs = async (req, res, next) => {
    const { queryFor, proid, month, year, categoryid } = req.query;
    try {
        if (queryFor == "product") {
            if (!proid) {
                res.json(createResponse(null, "Required query missing", true));
            }
            else {
                const productSummaries = await getProductSummariesByProductid(proid);

                let total = productSummaries.rows.reduce(
                    (acc, obj) => {
                        acc[0] += obj.NEWADDQTY;
                        acc[1] += obj.TOTALOUT;
                        return acc;
                    },
                    [0, 0]
                );

                res.json(createResponse({
                    productSummaries: productSummaries.rows,
                    totalIn: total[0],
                    totalOut: total[1]
                }));
            }
        }
        else if (queryFor == "month") {
            if (!month || !year) {
                res.json(createResponse(null, "Required query missing", true));
            } else {
                const summMonth = `'${month}-${year}'`;
                const productSummaries = await getProductSummariesBySummMonth(
                    summMonth
                );

                let total = productSummaries.rows.reduce(
                    (acc, obj) => {
                        acc[0] += obj.NEWADDQTY;
                        acc[1] += obj.TOTALOUT;
                        return acc;
                    },
                    [0, 0]
                );

                res.json(
                    createResponse({
                        productSummaries: productSummaries.rows,
                        totalIn: total[0],
                        totalOut: total[1],
                        summMonth: summMonth,
                    })
                );
            }
        }
        else if (queryFor == "category") {
            if (!categoryid) {
                res.json(createResponse(null, "Required query missing", true));
            } else {
                let productSummaries = {};
                if (month && year) {
                    const summMonth = `'${month}-${year}'`;
                    productSummaries = await getProductSummariesBySummMonthAndCatId(
                        summMonth,
                        categoryid
                    );
                } else {
                    productSummaries = await getProductSummariesByCatId(categoryid);
                }

                let total = productSummaries.rows.reduce(
                    (acc, obj) => {
                        acc[0] += obj.NEWADDQTY;
                        acc[1] += obj.TOTALOUT;
                        return acc;
                    },
                    [0, 0]
                );
                res.json(createResponse({
                    productSummaries: productSummaries.rows,
                    totalIn: total[0],
                    totalOut: total[1],
                    category: productSummaries.rows[0].CATEGORYBN
                }));
            }
        }
        else {
            res.json(createResponse(null, "Invalid Query For", true));
        }
    } catch (err) {
        next(err);
    }
};




/**
 * Requisition Logs
 */
const requisitionLogs = async (req, res, next) => {
    const { queryFor, proid, fdate, tdate, hrid } = req.query;
    try {

        let response = {};

        if (queryFor === "date") {
            if (!fdate || !tdate) {
                res.json(createResponse(null, "Required query missing", true));
            }
            else {
                response = await getRequisitionsByDate(fdate, tdate);
            }
        }
        else if (queryFor === "product") {
            if (!proid) {
                res.json(createResponse(null, "Required query missing", true));
            }
            else {
                if (fdate && tdate) {
                    response = await getRequisitionsByProductAndDate(proid, fdate, tdate);
                }
                else {
                    response = await getRequisitionsByProduct(proid);
                }
            }
        }
        else if (queryFor === "person") {
            if (!hrid) {
                res.json(createResponse(null, "Required query missing", true));
            }
            else {
                if (fdate && tdate) {
                    response = await getRequisitionsByPersonAndDate(hrid, fdate, tdate);
                }
                else {
                    response = await getRequisitionsByPerson(hrid);
                }
            }
        }
        else {
            res.json(createResponse(null, "Invalid Query For", true));
        }

        if (response.rows) {
            const TotalApprove = response.rows.reduce(
                (acc, obj) => {
                    acc += obj.APROQTY;
                    return acc;
                }, 0);

            res.json(createResponse({
                products: response.rows,
                TotalApprove
            }));
        }
    }
    catch (err) {
        next(err)
    }
}


const userRequisitionLogs = async (req, res, next) => {
    const { fdate, tdate, month, year, hrid } = req.query;
    try {
        if (!hrid) {
            res.json(createResponse(null, "Required hrid missing", true));
        }
        else if (!fdate && !tdate && !month && !year) {
            res.json(createResponse(null, "Required query missing", true));
        }
        else if (fdate || tdate) {
            let from = fdate ? fdate : '2021-12-01';
            let to = tdate ? tdate : format(new Date(), "yyyy-MM-dd");

            const response = await getUserReqReportByDate(hrid, from, to);
            res.json(createResponse(response.rows));

        }
        else {
            let queryParameter;
            if (month) {
                let yr = year ? year : new Date().getFullYear();
                queryParameter = `${month}-${yr}`;
                const response = await getUserReqReportByMonth(hrid, queryParameter);
                res.json(createResponse(response.rows));
            }
            else {
                queryParameter = `-${year}`;
                const response = await getUserReqReportByYear(hrid, queryParameter);
                res.json(createResponse(response.rows));
            }
        }
    }
    catch (err) {
        next(err)
    }
}

const viewUserReqReport = async (req, res, next) => {
    const { hrid, requestid } = req.params;
    try {
        if (!hrid || !requestid) {
            res.json(createResponse(null, "Required params missing", true));
        }
        else {
            const response = await getUserSingleReqView(hrid, requestid);
            res.json(createResponse(response.rows));
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    entriesProductReport,
    productStockStatus,
    productLogs,
    requisitionLogs,
    userRequisitionLogs,
    viewUserReqReport
};
