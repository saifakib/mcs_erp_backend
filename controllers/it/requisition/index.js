const { createResponse } = require("../../../utils/responseGenerator");
const { insertRequisitionInfo } = require("../../../services/it/requisition");


/*------------- post ------------*/
const postRequisition = async (req, res, next) => {
    try {
        const { products, user_id } = req.body;

        const requisitionInfo = {
            hrid: user_id,
            requiDate: new Date(),
            status: 0,
            userRemarks: "User Test Remarks From Code"
        };

        let insertedId = await insertRequisitionInfo(requisitionInfo);
        const { outBinds } = insertedId;
        insertedId = outBinds.id[0];

        const requisitionProducts = products.map((item) => {
            const obj = {
                REQ_ID: insertedId,
                PRO_ID: item.pro_id,
                QUNTITY: item.prorequqty,
                APR_QTY: 0,
                APROQTY: 0
            };
            return obj;
        });
        const result = await postReqProduct(requisitionProducts);
        if(resultrowsAffected >= 1) {
            res.json(createResponse(null, "Requisition Success"));
        }
        
    } catch (err) {
        next(err.message);
    }
};



module.exports = {
    postRequisition,
}
