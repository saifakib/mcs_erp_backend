const { createResponse } = require("../../../utils/responseGenerator");
const { insertMaintananceReq } = require("../../../services/it/maintanance");


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
        const { user_id } = req.headers;
        const { ind_pro_id, ind_pro_req_id, user_remarks } = req.body;

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



/*-------------- PUT --------------*/

// const acceptUserRequisition = async (req, res, next) => {
//     try {
//         const { req_id } = req.body;
//         const data = {
//             REQ_STATUS: 2,
//             REQ_ID: Number(req_id),
//         };

//         const accept = await updateRequisition(data);

//         if (accept.rowsAffected === 1) {
//             res.json(createResponse(deny, "Requisition has been Accepted"));
//         }
//     } catch (error) {
//         next(error.message);
//     }
// };



module.exports = { postMaintanance }
