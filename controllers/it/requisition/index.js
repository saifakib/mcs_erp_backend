const { createResponse } = require("../../../utils/responseGenerator");
const { selectIndProductList, insertRequisitionInfo, insertManyProRequisition, insertManyIndProRequisition, insertSummaries, updateRequisition, updateStrBalance, updateProRequisition, updateManyIndProduct } = require("../../../services/it/requisition");
const { closestind, indexTo } = require("date-fns/fp");


/*------------- post ------------*/
const postRequisition = async (req, res, next) => {
    try {
        const { user_id } = req.headers;
        const { products, remarks } = req.body;

        const requisitionInfo = {
            hrid: user_id,
            status: 0,
            userRemarks: remarks
        };

        let insertedId = await insertRequisitionInfo(requisitionInfo);
        const { outBinds } = insertedId;
        insertedId = outBinds.id[0];

        const requisitionProducts = products.map((item) => {
            const obj = {
                REQ_ID: insertedId,
                PRO_ID: item.pro_id,
                QUNTITY: item.prorequqty,
                APR_QTY: 0
            };
            return obj;
        });
        const result = await insertManyProRequisition(requisitionProducts);
        if (result.rowsAffected >= 1) {
            res.json(createResponse(null, "Requisition Success"));
        }

    } catch (err) {
        next(err.message);
    }
};


/*-------------- PUT --------------*/
// Update requisition by itstore_officer
const putReqByItStoreOfficer = async (req, res, next) => {
    try {
        const { req_id, products, str_remarks } = req.body;

        let reqProdCount = products.length;
        for (let i = 0; i < products.length; i++) {
            let product = products[i];
            let ind = i;
            // }
            // products.forEach(async (product, ind) => {

            let totalAprQty = 0;
            let strCount = product.store.length;
            for (let j = 0; j < product.store.length; j++) {
                let item = product.store[j];
                let index = j;
                // }
                // product.store.forEach(async (item, index) => {
                if (item.qty > 0) {
                    const updateStoreBanalce = await updateStrBalance(item.str_pro_id, item.qty);
                    totalAprQty += item.qty;

                    if (updateStoreBanalce.rowsAffected === 1) {
                        const indProdLists = await selectIndProductList(item.str_pro_id, 0);

                        if (indProdLists.rows.length > 0) {
                            const updatedIndProdLists = indProdLists.rows.slice(0, item.qty);

                            const updateIndStoreProd = await updateManyIndProduct(updatedIndProdLists);

                            if (updateIndStoreProd.rowsAffected >= 1) {
                                const postIndProReq = await insertManyIndProRequisition(product.pro_req_id, updatedIndProdLists)

                                if (postIndProReq.rowsAffected >= 1) {
                                    const dataToInsertSummaries = {
                                        PRO_ID: product.pro_id,
                                        STR_PRO_ID: item.str_pro_id,
                                        TOTAL_OUT: item.qty,
                                        SUM_TYPE: "Out"
                                    };
                                    let insertSumm = await insertSummaries(dataToInsertSummaries);
                                    if (insertSumm.rowsAffected >= 1) {
                                        strCount -= 1;
                                    }
                                }
                            } 
                        } 
                    } 
                } else {
                    strCount -= 1;
                }
            }
            //)

            // Update pro requisition apr_qty
            if (strCount === 0) {
                const putProRequsition = await updateProRequisition(product.pro_req_id, totalAprQty);
                if (putProRequsition.rowsAffected === 1) {
                    reqProdCount -= 1;
                }
            }
        }
        //);

        if (reqProdCount === 0) {
            const updateObj = {
                REQ_STATUS: 1,
                STR_REMARKS: str_remarks,
                REQ_ID: Number(req_id),
            };

            const requistionUpdate = await updateRequisition(updateObj);
            if (requistionUpdate.rowsAffected === 1) {
                res.json(createResponse(null, "Requisition Approved"));
            }
        }

    } catch (error) {
        next(error.message);
    }
};

const denyRequisition = async (req, res, next) => {
    try {
        const { req_id, denyRemarks } = req.body;
        const data = {
            REQ_STATUS: 3,
            STR_REMARKS: denyRemarks,
            REQ_ID: Number(req_id),
        };

        const deny = await updateRequisition(data);

        if (deny.rowAffected === 1) {
            res.json(createResponse(deny, "Requisition has been denied"));
        }
    } catch (error) {
        next(error.message);
    }
};



module.exports = {
    postRequisition,
    putReqByItStoreOfficer,
    denyRequisition
}
