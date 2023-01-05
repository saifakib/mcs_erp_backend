const { createResponse } = require("../../../utils/responseGenerator");
// const { getRequisitionStatusCount, getStockAlert } = require("../../../services/store/warehouse");
const { selectStoreProducts } = require("../../../services/it/product");
const { selectRequisitionCountWithApprovd, selectCountStockAlert } = require("../../../services/it/warehouse");


// /**
//  * Requisition Info By Status
//  */
// const requisitionInfoWithStatusCount = async (_, res, next) => {
//     try {
//         const response = await getRequisitionStatusCount();
//         const stockAlert = await getStockAlert();

//         const { PENDINGCOUNT, APPROVEDCOUNT, DENIEDCOUNT, DONECOUNT} = response.rows[0];
//         res.json(
//             createResponse({
//                 TOTALREQUISITION: PENDINGCOUNT + APPROVEDCOUNT + DENIEDCOUNT + DONECOUNT,
//                 PENDINGCOUNT, 
//                 APPROVEDCOUNT, 
//                 DENIEDCOUNT,
//                 DONECOUNT,
//                 STOCKALERT: stockAlert.rows.length
//             })
//         );
//     } catch (err) {
//         next(err);
//     }
// };

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

        const totalQuantites = totalProducts.reduce((acc, obj) => acc + (obj.QUANTITY - obj.NON_WORKABLE), 0)

        res.json(
            createResponse({
                totalProducts: totalProducts.length,
                totalQuantites: totalQuantites,
                totalrequisitions: totalRequisition[0].TOTALREQUISITIONS,
                totalAppRequisitions: totalRequisition[0].APPROVEDREQUISITIONS,
            }, "Admin Dashboad")
        );

    } catch (err) {
        next(err);
    }
};


module.exports = {
    //     requisitionInfoWithStatusCount,
    getStockAlertList,
    requisitionStatusForAdmin
}