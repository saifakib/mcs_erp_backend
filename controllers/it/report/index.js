const { createResponse } = require("../../../utils/responseGenerator");
const { selectAllEntriesReports, selectsingleEntriesReports, selectRequisitionByDate, selectRequisitionByProdDate, selectRequisitionByProId, selectRequisitionByHrid, selectRequisitionByDateHrid, selectMaintananceByDate, selectMaintananceByProDate, selectMaintananceByProId, selectMaintananceByHrDate, selectMaintananceByHrId} = require("../../../services/it/report");
const { format } = require('date-fns')


/**
 * Report - Product Entries All & Single
 */
const getEntriesProductReport = async (req, res, next) => {
    const { queryFor, product_id, fdate, tdate } = req.query;
    try {
        if (queryFor == "all") {
            if (!fdate || !tdate) {
                res.json(createResponse(null, "Required query missing", true));
            } else {
                const response = await selectAllEntriesReports(fdate, tdate);

                const Total = response.rows.reduce(
                    (acc, obj) => {
                        acc[0] += obj.QUANTITES;
                        acc[1] += obj.TOTAL_AMOUNT;
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
            if (!product_id || !fdate || !tdate) {
                res.json(createResponse(null, "Required query missing", true));
            } else {
                const response = await selectsingleEntriesReports(
                    product_id,
                    fdate,
                    tdate
                );

                const Total = response.rows.reduce(
                    (acc, obj) => {
                        acc[0] += obj.QUANTITES;
                        acc[1] += obj.TOTAL_AMOUNT;
                        return acc;
                    },
                    [0, 0]
                );

                res.json(
                    createResponse({
                        products: response.rows,
                        totalProduct: response.rows.length,
                        TotalListQuantities: Total[0],
                        TotalListAmount: Total[1]
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
 * Report - Requisitions by date, product and person
 */
const getRequisitionReport = async (req, res, next) => {
    const { queryFor, product_id, fdate, tdate, hrid } = req.query;

    try {
        let response = {};

        if (queryFor == "date") {
            if (!fdate || !tdate) {
                res.json(createResponse(null, "Required query missing", true));
            } 
            else {
                response = await selectRequisitionByDate(fdate, tdate);
            }
        } 
        else if (queryFor === "product") {
            if (!product_id) {
                res.json(createResponse(null, "Required query missing", true));
            }
            else {
                if (fdate && tdate) {
                    response = await selectRequisitionByProdDate(product_id, fdate, tdate);
                }
                else {
                    response = await selectRequisitionByProId(product_id);
                }
            }
        } 
        else if (queryFor === "person") {
            if (!hrid) {
                res.json(createResponse(null, "Required query missing", true));
            }
            else {
                if (fdate && tdate) {
                    response = await selectRequisitionByDateHrid(hrid, fdate, tdate);
                }
                else {
                    response = await selectRequisitionByHrid(hrid);
                }
            }
        }
        else {
            res.json(createResponse(null, "Invalid Query For", true));
        }

        if (response.rows) {
            const TotalApprove = response.rows.reduce(
                (acc, obj) => {
                    acc[0] += obj.REQ_QTY;
                    acc[1] += obj.APR_QTY;
                    return acc;
                }, [0, 0]);

            res.json(createResponse({
                products: response.rows,
                TotalRequest: TotalApprove[0],
                TotalApprove: TotalApprove[1]
            }));
        }
    } catch (err) {
        next(err);
    }
};


/**
 * Report - Maintanance by date, product and person
 */
const getMaintananceReport = async (req, res, next) => {
    const { queryFor, product_id, fdate, tdate, hrid } = req.query;
    try {
        let response = {};

        if (queryFor == "date") {
            if (!fdate || !tdate) {
                res.json(createResponse(null, "Required query missing!!", true));
            } 
            else {
                response = await selectMaintananceByDate(fdate, tdate);
            }
        } 
        else if (queryFor === "product") {
            if (!product_id) {
                res.json(createResponse(null, "Required query missing", true));
            }
            else {
                if (fdate && tdate) {
                    response = await selectMaintananceByProDate(product_id, fdate, tdate);
                }
                else {
                    response = await selectMaintananceByProId(product_id);
                }
            }
        } 
        else if (queryFor === "person") {
            if (!hrid) {
                res.json(createResponse(null, "Required query missing", true));
            }
            else {
                if (fdate && tdate) {
                    response = await selectMaintananceByHrDate(hrid, fdate, tdate);
                }
                else {
                    response = await selectMaintananceByHrId(hrid);
                }
            }
        }
        else {
            res.json(createResponse(null, "Invalid Query For", true));
        }

        if (response.rows) {
            res.json(createResponse({
                maintanances: response.rows
            }));
        }
    } catch (err) {
        next(err);
    }
};


module.exports = {
    getEntriesProductReport,
    getRequisitionReport,
    getMaintananceReport
};
