const { createResponse } = require("../../../utils/responseGenerator");
const { selectMaintanances, selectMaintanance, insertMaintananceReq, insertServicing, updateMaintanance, updateServicing } = require("../../../services/it/maintanance");
const { updateIndProReq } = require("../../../services/it/requisition");
const { updateIndProduct } = require("../../../services/it/product")


/*------------- get ------------*/
const getMaintanances = async (req, res, next) => {
    const { role, hrid } = req.query;
    try {
        if (role == 'admin') {
            const maintanance = await selectMaintanances();
            res.json(createResponse(maintanance.rows, `All Maintanance Report`));
        }
        else if (role == 'user') {
            const maintanance = await selectMaintanances(hrid);
            res.json(createResponse(maintanance.rows, `Single User Maintanance Report`));
        }
    } catch (err) {
        next(err.message)
    }
}


const getMaintanance = async (req, res, next) => {
    const { maintanance_id } = req.params;
    try {
        if (typeof (maintanance_id) !== "number" && !maintanance_id) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const maintanance = await selectMaintanance(maintanance_id);
            res.json(createResponse(maintanance.rows[0], `Single Maintanance Report`));
        }
    } catch (err) {
        next(err.message)
    }
}


/*------------- post ------------*/
const postMaintanance = async (req, res, next) => {
    try {
        //const { user_id } = req.headers;
        const { user_id, ind_pro_id, ind_pro_req_id, user_remarks } = req.body;

        const maintananceRequest = {
            hrid: user_id,
            indProReqId: ind_pro_req_id,
            indProId: ind_pro_id,
            userRemarks: user_remarks,
            status: 0
        };

        const maintananceRequestR = await insertMaintananceReq(maintananceRequest);
        const updateIndProReqU = await updateIndProReq(ind_pro_req_id, 1);
        const updateIndPro = await updateIndProduct(ind_pro_id, 2);

        if (maintananceRequestR.rowsAffected >= 1 && updateIndProReqU.rowsAffected === 1 && updateIndPro.rowsAffected === 1) {
            res.json(createResponse(null, "Maintanance Request Success", false));
        }
    } catch (err) {
        next(err.message);
    }
};

const postServicing = async (req, res, next) => {
    try {
        const { maintanance_id, problem } = req.body;

        const postServing = await insertServicing(maintanance_id, problem);
        const updateMaintananceN = await updateMaintanance(Number(3), maintanance_id);

        if (postServing.rowsAffected === 1 && updateMaintananceN.rowsAffected === 1) {
            res.json(createResponse(null, "Servicing Posted", false));
        } else {
            res.json(createResponse(null, "Something went wrong", true));
        }

    } catch (err) {
        next(err.message);
    }
}


/*-------------- PUT --------------*/

const putMaintanance = async (req, res, next) => {
    try {
        const { status, maintanance_id } = req.body;
        if (typeof (status) !== 'number' && typeof (maintanance_id) !== 'number') {
            res.json(createResponse("Error Occured", "Value should be a number", true));
        }
        else {
            const accept = await updateMaintanance(status, maintanance_id);

            const conStatus = [5, 7];
            if (conStatus.includes(status)) {
                const { rows } = await selectMaintanance(maintanance_id);
                if (status === 5) {      // Maintanace Dead Status 5
                    const updateIndProReqU = await updateIndProReq(rows[0].IND_PRO_REQ_ID, 2);
                    const updateIndPro = await updateIndProduct(rows[0].IND_PRO_ID, 4);

                    if (accept.rowsAffected === 1 && updateIndProReqU.rowsAffected === 1 && updateIndPro.rowsAffected === 1) {
                        res.json(createResponse(null, "Maintanance status has been Updated"));
                    }
                }
                else {
                    const updateIndProReqU = await updateIndProReq(rows[0].IND_PRO_REQ_ID, 0);
                    const updateIndPro = await updateIndProduct(rows[0].IND_PRO_ID, 1);

                    if (accept.rowsAffected === 1 && updateIndProReqU.rowsAffected === 1 && updateIndPro.rowsAffected === 1) {
                        res.json(createResponse(null, "Maintanance status has been Updated"));
                    }
                }
            }
            else {
                if (accept.rowsAffected === 1) {
                    res.json(createResponse(null, "Maintanance status has been Updated"));
                }
            }
        }
    } catch (error) {
        next(error.message);
    }
};

const putServicing = async (req, res, next) => {
    try {
        const { maintanance_id, remarks, cost } = req.body;
        if (typeof (maintanance_id) !== 'number') {
            res.json(createResponse("Error Occured", "Value should be a number", true));
        }
        else {
            const putServing = await updateServicing(maintanance_id, remarks);
            const updateMaintananceR = await updateMaintanance(Number(4), maintanance_id, cost);


            if (updateMaintananceR.rowsAffected === 1 && putServing.rowsAffected === 1) {
                res.json(createResponse(null, "Maintanance and Servicing status has been Updated"));
            }
        }
    } catch (error) {
        next(error.message);
    }
};


module.exports = { getMaintanances, getMaintanance, postMaintanance, postServicing, putMaintanance, putServicing }
