const { createResponse } = require("../../../utils/responseGenerator");
const { selectUserReqIsPending, selectUserRequisitions, selectUserAcceptRequisitions, selectUserAcceptActiveRequisitions, selectStatusRequisitions, selectIndProductList, selectRequisitionById, selectAllDetailsRequisitionById, selectIndRequisitionById, selectIndividualUserRequisitions, insertRequisitionInfo, insertManyProRequisition, insertManyIndProRequisition, insertSummaries, updateRequisition, updateStrBalance, updateProRequisition, updateManyIndProduct, updateReqGivenByIT, updateIndProReq } = require("../../../services/it/requisition");

const { updateIndProduct } = require("../../../services/it/product")

/**
 * IT Requisition Status Code
 * 0 - Pending
 * 1 - Approve
 * 2 - Accept
 * 3 - Deny
 * 
 * IT Requisition Given Status Code
 * 1 - Given
 * 0 - Not Given
 * 
 * IT Individual Product Requisition Status Code
 * 0 - Approve
 * 1 - Maintanance
 * 2 - Dead
 * 3 - Return
 */


/*------------- get ------------*/
const getUserRequitions = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        if (typeof (user_id) !== 'number' && !user_id) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const userRequisitions = await selectUserRequisitions(user_id);
            res.json(createResponse(userRequisitions.rows, "All User Requisition"));
        }
    } catch (err) {
        next(err.message);
    }
}

const getUserReqIsPending = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        if (typeof (user_id) !== 'number' && !user_id) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const { rows } = await selectUserReqIsPending(user_id);
            const data = rows[0];
            if (data) {
                res.json(createResponse(data));
            } else {
                res.json(createResponse({}, "No requisition found", true));
            }
        }
    } catch (err) {
        next(err.message)
    }
}

const getUserAcceptRequitions = async (req, res, next) => {
    try {
        const { user_id } = req.headers;
        const userRequisitions = await selectUserAcceptRequisitions(user_id);
        res.json(createResponse(userRequisitions.rows, "User Accept Product"));
    } catch (err) {
        next(err.message);
    }
}

const getUserAcceptRequition = async (req, res, next) => {
    try {
        const { req_id } = req.params;
        if (typeof (req_id) !== 'number' && !req_id) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const userRequisition = await selectRequisitionById(req_id, 2)   // 2 -> Accept

            const userRequisitionRearrange = userRequisition.rows.reduce((acc, obj, index) => {
                const newObj = {
                    PRODUCT_ID: obj.PRODUCT_ID,
                    PRODUCT_NAME: obj.PRODUCT_NAME,
                    UNIQUE_V: obj.UNIQUE_V,
                    BRAND_NAME: obj.BRAND_NAME,
                    UNIT_NAME: obj.UNIT_NAME,
                    REQ_UNTITY: obj.QUNTITY,
                    APR_QTY: obj.APR_QTY,
                    USER_REMARKS: obj.USER_REMARKS,
                    PRO_REQ_ID: obj.PRO_REQ_ID
                }
                acc[index] = newObj;
                return acc;
            }, []);

            res.json(createResponse({
                USER: {
                    NAME_ENGLISH: userRequisition.rows[0].NAME_ENGLISH,
                    MOBILE_PHONE: userRequisition.rows[0].MOBILE_PHONE,
                    DEPARTEMENT: userRequisition.rows[0].DEPARTEMENT,
                    DESIGNATION: userRequisition.rows[0].DESIGNATION,
                    REQ_ID: userRequisition.rows[0].REQ_ID,
                    REQ_DATE: userRequisition.rows[0].REQ_DATE,
                    REQ_TIME: userRequisition.rows[0].REQ_TIME,
                    T_REQQUNTITY: userRequisition.rows[0].T_REQQUNTITY,
                    T_APR_QTY: userRequisition.rows[0].T_APR_QTY
                },
                REQUISITIONS: userRequisitionRearrange

            }, "User SingleRequisition"));
            //res.json(createResponse(userRequisition.rows, "User SingleRequisition"));
        }
    } catch (err) {
        next(err.message);
    }
}

const getUserAcceptActiveRequitions = async (req, res, next) => {
    try {
        const { user_id } = req.headers;
        const userRequisitions = await selectUserAcceptActiveRequisitions(user_id);
        res.json(createResponse(userRequisitions.rows, "User Accept Product"));
    } catch (err) {
        next(err.message);
    }
}

const getAdminRequisitions = async (req, res, next) => {
    let { status, given } = req.query;
    try {
        let allPendingRequitions = {};
        if (status == 2) {
            if (typeof given === "undefined") {
                allPendingRequitions = await selectStatusRequisitions(status, ts = false);
            } else {
                let statusNum = [0, 1];
                if (statusNum.includes(Number(given))) {
                    allPendingRequitions = await selectStatusRequisitions(status, ts = true, given);
                } else {
                    allPendingRequitions = await selectStatusRequisitions(status, ts = false);
                }
            }
        } else {
            allPendingRequitions = await selectStatusRequisitions(status, ts = false);
        }
        let msg = status == 0 ? "Pending" : status == 1 ? "Approve" : status == 2 ? "Accept" : "Deny";
        if (status >= 0 && status <= 3) {
            res.json(createResponse(allPendingRequitions.rows, `All ${msg} Requisition`));
        } else {
            res.json(createResponse(null, "Invalid Requisition Status", true));
        }
    } catch (err) {
        next(err.message)
    }
}

const getRequsition = async (req, res, next) => {
    const { req_id } = req.params;
    try {
        if (typeof (req_id) !== 'number' && !req_id) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const response = await selectRequisitionById(req_id, 0);

            if (response.rows.length === 0) {
                res.json(createResponse(null, "This requisition doesn't exit", true))
            }
            else {
                const changeResponse = response.rows.reduce((acc, val, index) => {
                    acc[index] = {
                        PRO_REQ_ID: val.PRO_REQ_ID,
                        QUNTITY: val.QUNTITY,
                        PRODUCT_ID: val.PRODUCT_ID,
                        PRODUCT_NAME: val.PRODUCT_NAME
                    }
                    return acc;
                }, [])

                res.json(createResponse({
                    REQ_ID: response.rows[0].REQ_ID,
                    REQ_DATE: response.rows[0].REQ_DATE,
                    REQ_TIME: response.rows[0].REQ_TIME,
                    USER_REMARKS: response.rows[0].USER_REMARKS,
                    PRO_REQUISITIONS: [...changeResponse],
                    USER: {
                        NAME_ENGLISH: response.rows[0].NAME_ENGLISH,
                        MOBILE_PHONE: response.rows[0].MOBILE_PHONE,
                        DEPARTEMENT: response.rows[0].DEPARTEMENT,
                        DESIGNATION: response.rows[0].DESIGNATION,
                    }
                }, "User Request Requisition Details"));
            }
        }
    } catch (err) {
        next(err.message)
    }
}

const getAllDetailsRequisition = async (req, res, next) => {
    try {
        const { req_id } = req.params;
        if (typeof (req_id) !== 'number' && !req_id) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const userRequisition = await selectAllDetailsRequisitionById(req_id)

            const userRequisitionRearrange = userRequisition.rows.reduce((acc, obj, index) => {
                const newObj = {
                    PRODUCT_ID: obj.PRODUCT_ID,
                    PRODUCT_NAME: obj.PRODUCT_NAME,
                    UNIQUE_V: obj.UNIQUE_V,
                    BRAND_NAME: obj.BRAND_NAME,
                    UNIT_NAME: obj.UNIT_NAME,
                    REQ_UNTITY: obj.QUNTITY,
                    APR_QTY: obj.APR_QTY,
                    USER_REMARKS: obj.USER_REMARKS,
                    PRO_REQ_ID: obj.PRO_REQ_ID
                }
                acc[index] = newObj;
                return acc;
            }, []);

            res.json(createResponse({
                USER: {
                    NAME_ENGLISH: userRequisition.rows[0].NAME_ENGLISH,
                    MOBILE_PHONE: userRequisition.rows[0].MOBILE_PHONE,
                    DEPARTEMENT: userRequisition.rows[0].DEPARTEMENT,
                    DESIGNATION: userRequisition.rows[0].DESIGNATION,
                    REQ_ID: userRequisition.rows[0].REQ_ID,
                    REQ_DATE: userRequisition.rows[0].REQ_DATE,
                    REQ_TIME: userRequisition.rows[0].REQ_TIME,
                    T_REQQUNTITY: userRequisition.rows[0].T_REQQUNTITY,
                    T_APR_QTY: userRequisition.rows[0].T_APR_QTY
                },
                REQUISITIONS: userRequisitionRearrange

            }, "User SingleRequisition Details"));
        }
    } catch (err) {
        next(err.message);
    }
}

const getIndividualUserRequitions = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        if (typeof (user_id) !== 'number' && !user_id) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const userRequisitions = await selectIndividualUserRequisitions(user_id);
            res.json(createResponse(userRequisitions.rows, "Users Product"));
        }
    } catch (err) {
        next(err.message);
    }
}




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
// Helper Function 
const productModification = (products) => {
    const mod1 = products.reduce((acc, obj) => {
        if (acc[obj.pro_req_id]) {
            acc[obj.pro_req_id]["totalAprQty"] = Number(acc[obj.pro_req_id]["totalAprQty"]) + Number(obj.qty),
                acc[obj.pro_req_id]["store"].push({
                    str_pro_id: obj.str_pro_id,
                    qty: obj.qty
                })
        } else {
            acc[obj.pro_req_id] = {
                pro_req_id: obj.pro_req_id,
                pro_id: obj.pro_id,
                reqQty: obj.reqQty,
                totalAprQty: obj.qty,
                store: [{
                    str_pro_id: obj.str_pro_id,
                    qty: obj.qty
                }]
            }
        }
        return acc;
    }, {});

    const mod2 = Object.keys(mod1).reduce((acc, key) => {
        acc.push(mod1[key])
        return acc;
    }, []);

    return mod2;
}

const quantityChecking = (products) => {
    let response = true;

    products.forEach((item) => {
        if (item.reqQty < item.totalAprQty) {
            response = false;
        }
    })

    return response;
}
const putReqByItStoreOfficer = async (req, res, next) => {
    try {
        let { req_id, products, str_remarks, given = false } = req.body;

        products = productModification(products);
        let response = quantityChecking(products);
        if (response) {
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

                // Generate 4 digits OTP
                const OTP = Math.floor(1000 + Math.random() * 9000);

                const requistionUpdate = await updateRequisition(updateObj, given, OTP);
                if (requistionUpdate.rowsAffected === 1) {
                    res.json(createResponse(null, "Requisition Approved"));
                }
            }
        } else {
            res.json(createResponse("Error Occured", "You have seleted item number which is bigger than user requition", true));
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

        if (deny.rowsAffected === 1) {
            res.json(createResponse(deny, "Requisition has been denied"));
        }
    } catch (error) {
        next(error.message);
    }
};

const acceptUserRequisition = async (req, res, next) => {
    try {
        const { req_id } = req.body;
        const data = {
            REQ_STATUS: 2,
            REQ_ID: Number(req_id),
        };

        const accept = await updateRequisition(data);

        if (accept.rowsAffected === 1) {
            res.json(createResponse(null, "Requisition has been Accepted"));
        }
    } catch (error) {
        next(error.message);
    }
};

// given status change
const putRequisitionGivenStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.json(createResponse(null, "Requisitions id missing", true));
        } else {
            const result = await updateReqGivenByIT(id);
            if (result.rowsAffected === 1) {
                res.json(createResponse(null, "Requisition Given"));
            }
        }
    } catch (err) {
        next(err)
    }
}

// Update Individual Requisition Status
const putIndRequisition = async (req, res, next) => {
    try {
        const { ind_pro_req_id } = req.params;

        if (!ind_pro_req_id) {
            res.json(createResponse(null, "Requisitions id missing", true));
        }
        else {
            const findIndRequisition = await selectIndRequisitionById(ind_pro_req_id);

            if (findIndRequisition.rows.length > 0) {
                const updateIndRequisition = await updateIndProReq(ind_pro_req_id, 3);  // STATUS 3 FOR RETURN PRODUCT TO IT

                if (updateIndRequisition.rowsAffected === 1) {
                    const updateIndProd = await updateIndProduct(findIndRequisition.rows[0]["IND_PRODUCT_ID"], 0);

                    if (updateIndProd.rowsAffected === 1) {
                        res.json(createResponse(null, "Requisition Update Successfull"));
                    }
                    else {
                        res.json(createResponse(null, "Something error occured", true));
                    }
                }
                else {
                    res.json(createResponse(null, "Requisitions not updated", true));
                }
            }
            else {
                res.json(createResponse(null, "Requisitions id not found", true));
            }
        }
    } catch (err) {
        next(err.message)
    }
}



module.exports = {
    getRequsition,
    getUserReqIsPending,
    getUserRequitions,
    getUserAcceptRequitions,
    getUserAcceptRequition,
    getUserAcceptActiveRequitions,
    getAdminRequisitions,
    getAllDetailsRequisition,
    getIndividualUserRequitions,
    postRequisition,
    putReqByItStoreOfficer,
    putRequisitionGivenStatus,
    putIndRequisition,
    denyRequisition,
    acceptUserRequisition
}
