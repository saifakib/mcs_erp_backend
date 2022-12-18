const { createResponse } = require("../../../utils/responseGenerator");
const { selectAllEntriesReports, selectsingleEntriesReports } = require("../../../services/it/report");
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

                console.log(response);

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


module.exports = {
    getEntriesProductReport,
};
