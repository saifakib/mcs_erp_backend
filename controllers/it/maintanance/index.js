const { createResponse } = require("../../../utils/responseGenerator");
const { insertMaintananceReq, insertServicing, updateMaintanance, updateServicing } = require("../../../services/it/maintanance");


/*------------- get ------------*/
// const getAdminRequisitions = async (req, res, next) => {
//     const { status } = req.query;
//     try {
//         const allPendingRequitions = await selectStatusRequisitions(status);
//         let msg = status == 0 ? "Pending" : status == 1 ? "Approve" : status == 2 ? "Accept" : "Deny";
//         if (status >= 0 && status <= 3) {
//             res.json(createResponse(allPendingRequitions.rows, `All ${msg} Requisition`));
//         } else {
//             res.json(createResponse(null, "Invalid Requisition Status", true));
//         }
//     } catch (err) {
//         next(err.message)
//     }
// }


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

        let maintananceRequestR = await insertMaintananceReq(maintananceRequest);

        if (maintananceRequestR.rowsAffected >= 1) {
            res.json(createResponse(null, "Maintanance Request Success", false));
        }
    } catch (err) {
        next(err.message);
    }
};

const postServicing = async (req, res, next) => {
    try{
        const { maintanance_id, problem } = req.body;

        const postServing = await insertServicing(maintanance_id, problem);
        const updateMaintanance = await updateMaintanance(Number(4), maintanance_id);

        if(postServing.rowsAffected === 1 && updateMaintanance.rowsAffected === 1) {
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

            if (accept.rowsAffected === 1) {
                res.json(createResponse(null, "Maintanance status has been Updated"));
            }
        }
    } catch (error) {
        next(error.message);
    }
};

const putServicing = async (req, res, next) => {
    try {
        const { maintanance_id, remarks } = req.body;
        if (typeof (maintanance_id) !== 'number') {
            res.json(createResponse("Error Occured", "Value should be a number", true));
        }
        else {
            const putServing = await updateServicing(maintanance_id, remarks);
            const updateMaintananceR = await updateMaintanance(Number(5), maintanance_id);

            if (updateMaintananceR.rowsAffected === 1 && putServing.rowsAffected === 1) {
                res.json(createResponse(null, "Maintanance and Servicing status has been Updated"));
            }
        }
    } catch (error) {
        next(error.message);
    }
};


module.exports = { postMaintanance, postServicing, putMaintanance, putServicing }
