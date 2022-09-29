const { createResponse } = require("../../../utils/responseGenerator");
const { getRequisitionStatusCount, getStockAlert } = require("../../../services/store/warehouse");
const { getTotalStoreProducts, getTotalEntQuantites } = require("../../../services/store/product");
const { getTotalProReqQuantities } = require("../../../services/store/requisitions");


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

const requisitionStatusForAdmin = async (_, res, next) => {
    try {

        const {rows: totalProducts} = await getTotalStoreProducts();
        const { rows: totalQuantites } = await getTotalEntQuantites();
        const { rows: proRequisition } = await getTotalProReqQuantities();

        res.json(
            createResponse({
                totalProducts: totalProducts[0].TOTAL_PRODUCT,
                totalQuantites: totalQuantites[0].TOTAL_QUANTITIES,
                totalrequisitions: proRequisition[0].TOTALREQUISITIONS,
                totalApprovedqty: proRequisition[0].APPROVEDQTY,
            })
        );
        
    } catch (err) {
        next(err);
    }
};


module.exports = { 
    requisitionInfoWithStatusCount,
    stockAlertList,
    requisitionStatusForAdmin
}