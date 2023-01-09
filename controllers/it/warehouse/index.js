const { createResponse } = require("../../../utils/responseGenerator");
const { selectStoreProducts } = require("../../../services/it/product");
const { selectRequisitionCountWithApprovd, selectTotalReqQtyAndAprQtyProducts, selectRequisitionStatusCount, selectCountStockAlert, selectUserRequisitionCount, selectUserReqQtyAndAprQtyProducts } = require("../../../services/it/warehouse");


/**
 * Requisition Info By Status
 */
const requisitionInfoWithStatusCount = async (_, res, next) => {
    try {
        const response = await selectRequisitionStatusCount();
        const stockAlert = await selectCountStockAlert();

        const { PENDINGCOUNT, APPROVEDCOUNT, DENIEDCOUNT, DONECOUNT } = response.rows[0];
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

const getStockAlertList = async (_, res, next) => {
    try {
        const response = await selectCountStockAlert();

        res.json(
            createResponse(response.rows)
        )
    } catch (err) {
        next(err);
    }
}

const requisitionStatusForAdmin = async (_, res, next) => {
    try {

        const { rows: totalProducts } = await selectStoreProducts();
        const { rows: totalRequisition } = await selectRequisitionCountWithApprovd();
        const { rows: totalReqProdAndApprove } = await selectTotalReqQtyAndAprQtyProducts();

        const totalQuantites = totalProducts.reduce((acc, obj) => acc + (obj.QUANTITY - obj.NON_WORKABLE), 0);

        res.json(
            createResponse({
                totalProducts: totalProducts.length,
                totalQuantites: totalQuantites,
                totalRequisitions: totalRequisition[0].TOTALREQUISITIONS,
                totalRequisitionProducts: totalReqProdAndApprove[0].REQ_QUANTITY,
                totalAprRequisitions: totalRequisition[0].APPROVEDREQUISITIONS,
                totalAprRequisitionProducts: totalReqProdAndApprove[0].APR_QUANTITY
            }, "Admin Dashboad")
        );

    } catch (err) {
        next(err);
    }
};

const userDashboardInfo = async (req, res, next) => {
    const { hrid } = req.params;
    try {
        if (typeof (hrid) !== 'number' && !hrid) {
            res.json(createResponse(null, "Required Parameter Missing", true));
        }
        else {
            const { rows: requisitions } = await selectUserRequisitionCount(hrid);
            const { rows: totalReqProdAndApprove } = await selectUserReqQtyAndAprQtyProducts(hrid);

            res.json(
                createResponse({
                    Approved: requisitions[0].APPROVED,
                    Denied: requisitions[0].DENIED,
                    Products: totalReqProdAndApprove[0].APR_QUANTITY,
                    Request: totalReqProdAndApprove[0].REQ_QUANTITY
                }, "User Dashboard")
            );
        }

    } catch (err) {
        next(err)
    }
}


module.exports = {
    requisitionInfoWithStatusCount,
    getStockAlertList,
    requisitionStatusForAdmin,
    userDashboardInfo
}