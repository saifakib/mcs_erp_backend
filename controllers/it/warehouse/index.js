const { createResponse } = require("../../../utils/responseGenerator");
const { selectStoreProducts } = require("../../../services/it/product");
const { selectRequisitionCountWithApprovd, selectTotalReqQtyAndAprQtyProducts, selectRequisitionStatusCount, selectCountStockAlert, selectUserRequisitionCount, selectUserReqQtyAndAprQtyProducts, assetManualDepReport } = require("../../../services/it/warehouse");


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


const getAssetManualDepartmentReport = async (req, res, next) => {
    const { dep_id } = req.params;
    try {
        if (typeof dep_id !== "number" && !dep_id) {
            res.json(createResponse(null, "Required Parameter Missing", true));
        } else {
            const { rows: result } = await assetManualDepReport(dep_id);
            let employeesArr = result.reduce((acc, obj) => {
                if (acc[obj.EMP_ID]) {
                    acc[obj.EMP_ID].push(obj);
                } else {
                    acc[obj.EMP_ID] = [];
                    acc[obj.EMP_ID].push(obj);
                }
                return acc;
            }, {});

            let response = Object.keys(employeesArr).map((indEm) => {
                return employeesArr[indEm].reduce((acc, obj, index) => {
                    if (index == 0) {
                        acc["user"] = {
                            NAME_ENGLISH: obj.NAME_ENGLISH,
                            DEPARTEMENT: obj.DEPARTEMENT,
                            DESIGNATION: obj.DESIGNATION,
                            DESIGNATION_BANGLA: obj.DESIGNATION_BANGLA,
                            MOBILE_PHONE: obj.MOBILE_PHONE,
                            NAME_BANGLA: obj.NAME_BANGLA,
                            EMP_ID: obj.EMP_ID
                        };
                    }
                    let newObj = {
                        P_NAME: obj.P_NAME,
                        DETAILS: obj.DETAILS,
                        YEAR: obj.YEAR,
                        QUANTITY: obj.QUANTITY,
                        SOURCE: obj.SOURCE,
                        FILES: obj.FILES,
                        V_FILE: obj.V_FILE,
                        ENTRY_DATE: obj.ENTRY_DATE
                    };
                    if (acc["products"]) {
                        acc["products"][Number(obj.PRO_ID)] = newObj;
                    } else {
                        acc["products"] = {};
                        acc["products"][Number(obj.PRO_ID)] = newObj;
                    }
                    return acc;
                }, {});
            });
            res.json(createResponse(response, "Department Wise Person Products"))
        }
    } catch (err) {
        next(err);
    }
};


module.exports = {
    requisitionInfoWithStatusCount,
    getStockAlertList,
    requisitionStatusForAdmin,
    userDashboardInfo,
    getAssetManualDepartmentReport
}