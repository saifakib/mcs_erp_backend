const { createResponse } = require("../../../utils/responseGenerator");
const { selectIndProductList, insertRequisitionInfo, insertManyProRequisition, insertManyIndProRequisition, updateRequisition, updateStrBalance, updateProRequisition, updateManyIndProduct } = require("../../../services/it/requisition");


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

        products.forEach(async (product) => {
            const totalAprQty = 0;
            product.store.forEach(async (item) => {

                const updateStoreBanalce = await updateStrBalance(item.str_pro_id, item.qty);
                totalAprQty += item.qty;

                const indProdLists = await selectIndProductList(item.str_pro_id, 0);

                const updatedIndProdLists = indProdLists.rows.slice(0, item.qty);
                
                const updateIndStoreProd = await updateManyIndProduct(updatedIndProdLists);

                const postIndProReq = await insertManyIndProRequisition(product.pro_req_id, updatedIndProdLists)


            })

            // Update pro requisition apr_qty
            const putProRequsition = await updateProRequisition(product.pro_req_id, totalAprQty);

            // TODO: 
            // Update Summaries
            // const dataToInsert = {
            //     PRODUCTID: product.proid,
            //     PRODUCTNAME: product.proname,
            //     PROCAT: product.procate,
            //     INTIALQTY: balance,
            //     TOTALBALANCE: balance,
            //     TOTALOUT: product.qty,
            //     PRESENTBALANCE: newBalance,
            //     SUMMDATE: format(new Date(), "yyyy-MM-dd"),
            //     SUMMMONTH: format(new Date(), "LLLL-yyyy"),
            //     REQUISITIONFOR: product.hridno,
            //     SUMMERTYPE: "Out",
            // };

            // await insertSummeries(dataToInsert);
        });

        const updateObj = {
            REQ_STATUS: 1,
            STR_REMARKS: str_remarks,
            REQ_ID: Number(req_id),
        };

        const requistionUpdate = await updateRequisition(updateObj);
        if (requistionUpdate.rowAffected === 1) {
            res.json(createResponse(null, "Requisition Approved"));
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
