const { createResponse } = require("../../../utils/responseGenerator");
const { getRequisitionStatusCount } = require("../../../services/store/warehouse");


/**
 * Requisition Info By Status
 */
const requisitionInfoWithStatusCount = async (_, res, next) => {
    try {
        const response = await getRequisitionStatusCount();

        const { PENDINGCOUNT, APPROVEDCOUNT, STOREAPPRUVALCOUNT, DONECOUNT} = response.rows[0];
        res.json(
            createResponse({
                TOTALREQUISITION: PENDINGCOUNT + APPROVEDCOUNT + STOREAPPRUVALCOUNT + DONECOUNT,
                PENDINGCOUNT, 
                APPROVEDCOUNT, 
                STOREAPPRUVALCOUNT,
                DONECOUNT
            })
        );
    } catch (err) {
        next(err);
    }
};


module.exports = { 
    requisitionInfoWithStatusCount 
}