const { createResponse } = require("../../../utils/responseGenerator");
const { selectAllEntriesReports, selectsingleEntriesReports, selectRequisitionByDate, selectRequisitionByProdDate, selectRequisitionByProId, selectProductListRequisitions, selectProductRequisitionsByProId, selectRequisitionByHrid, selectRequisitionByDateHrid, selectIndividualProdRequisitions, selectMaintananceByDate, selectMaintananceByProDate, selectMaintananceByProId, selectMaintananceByHrDate, selectMaintananceByHrId, selectSpecificationsByIndProdId, selectChangesSpecificationsByIndProdId } = require("../../../services/it/report");
const { selectIndProductWIthDetails } = require("../../../services/it/product");
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
 * Report - Requisitions Show Product List
 */
const getProductListRequisitions = async (req, res, next) => {
    try {
        const response = await selectProductListRequisitions();
        res.json(createResponse(response.rows))
    } catch (err) {
        next(err.message)
    }
}

/**
 * Report - Requisitions Show by a individual product
 */
const getProductRequisitionsByProId = async (req, res, next) => {
    const { pro_id } = req.query;
    try {
        const response = await selectProductRequisitionsByProId(pro_id);
        res.json(createResponse(response.rows))
    } catch (err) {
        next(err.message)
    }
}

/**
 * Report - Requisitions Show by a individual product
 */
const getIndividualProdRequisitionHistory = async (req, res, next) => {
    const { ind_prod_id } = req.query;
    try {
        const response = await selectIndividualProdRequisitions(ind_prod_id);
        res.json(createResponse(response.rows))
    } catch (err) {
        next(err.message)
    }
}

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
                const { ind_prod_id } = req.query;
                let have = ind_prod_id ? true : false;

                if (have) {
                    if (fdate && tdate) {
                        response = await selectMaintananceByProDate(product_id, fdate, tdate, have, ind_prod_id);
                    }
                    else {
                        response = await selectMaintananceByProId(product_id, have, ind_prod_id);
                    }
                }
                else {
                    if (fdate && tdate) {
                        response = await selectMaintananceByProDate(product_id, fdate, tdate, have, {});
                    }
                    else {
                        response = await selectMaintananceByProId(product_id, have, {});
                    }
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
            const TotalCost = response.rows.reduce(
                (acc, obj) => {
                    acc += obj.COST;
                    return acc;
                }, 0);
            res.json(createResponse({
                maintanances: response.rows,
                TotalCost
            }));
        }
    } catch (err) {
        next(err);
    }
};


/**
 * Report - Specifications by product
*/
const getSpecificationsByIndProdIdReport = async (req, res, next) => {
    try {
        const { ind_prod_id } = req.query;
        if (!ind_prod_id) {
            res.json(createResponse(null, "Required query missing", true));
        } else {
            const prodInfo = await selectIndProductWIthDetails(ind_prod_id);
            const initialSpecifications = await selectSpecificationsByIndProdId(ind_prod_id);
            const changesSpecifications = await selectChangesSpecificationsByIndProdId(ind_prod_id);

            const changesSpecificationsFilter = changesSpecifications.rows.reduce((acc, obj) => {
                if (acc[obj.MAINTENANCE_ID]) {
                    acc[obj.MAINTENANCE_ID].push({
                        REQ_DATE: obj.REQ_DATE,
                        COST: obj.COST,
                        NAME: obj.NAME,
                        S_VALUE: obj.S_VALUE
                    })
                } else {
                    acc[obj.MAINTENANCE_ID] = []
                    acc[obj.MAINTENANCE_ID].push({
                        REQ_DATE: obj.REQ_DATE,
                        COST: obj.COST,
                        NAME: obj.NAME,
                        S_VALUE: obj.S_VALUE
                    })
                }
                return acc;
            }, {});

            const responseChangesFilter = Object.keys(changesSpecificationsFilter).reduce((acc, key, index) => {
                acc[index] = {
                    MAINTENANCE_ID: key,
                    COST: changesSpecificationsFilter[key][0]["COST"],
                    REQ_DATE: changesSpecificationsFilter[key][0]["REQ_DATE"],
                    DATA: changesSpecificationsFilter[key]
                }
                return acc;
            }, []);

            res.json(createResponse({
                productInfo: prodInfo.rows[0],
                initialSpecifications: initialSpecifications.rows,
                changesSpecifications: responseChangesFilter,
            }));
        }
    } catch (err) {
        next(err.message)
    }
}


module.exports = {
    getEntriesProductReport,
    getRequisitionReport,
    getProductListRequisitions,
    getProductRequisitionsByProId,
    getIndividualProdRequisitionHistory,
    getMaintananceReport,
    getSpecificationsByIndProdIdReport
};
