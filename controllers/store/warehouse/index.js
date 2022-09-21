const { createResponse } = require("../../../utils/responseGenerator");
const { getRequisitionStatusCount, getStockAlert } = require("../../../services/store/warehouse");


/**
 * Requisition Info By Status
 */
const requisitionInfoWithStatusCount = async (_, res, next) => {
    try {
        const response = await getRequisitionStatusCount();
        const stockAlert = await getStockAlert();

        const { PENDINGCOUNT, APPROVEDCOUNT, DENIEDCOUNT, DONECOUNT} = response.rows[0];
        res.json(
            createResponse({
                TOTALREQUISITION: PENDINGCOUNT + APPROVEDCOUNT + DENIEDCOUNT + DONECOUNT,
                PENDINGCOUNT, 
                APPROVEDCOUNT, 
                DENIEDCOUNT,
                DONECOUNT,
                STOCKALERT: stockAlert.rows.length
            })
        );
    } catch (err) {
        next(err);
    }
};

const stockAlertList = async (_, res, next) => {
    try {
        const response = await getStockAlert();

        res.json(
            createResponse(response.rows)
        )
    } catch (err) {
        next(err);
    }
}


module.exports = { 
    requisitionInfoWithStatusCount,
    stockAlertList
}