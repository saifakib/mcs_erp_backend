const { createResponse } = require("../../../utils/responseGenerator");
const { commitConnect, rollbackConnect, randConnect } = require('../../../utils/dbtransactions');

const { selectLastMrrNumber, selectNewProductListByCatId, selectStrProductsByCatId, selectCategoryWithStore, insertMrrLogs, insertStoreProduct, insertManyInd_Product, insertProductEntryLists, insertProdSummaries, insertExProdSummaries, updateStoreProduct,
} = require("../../../services/it/product");
const { number } = require("joi");


/*------------- All Get Controllers ---------------*/

const lastMrrNum = async (_, res, next) => {
    try {
        let mrrNumber = await selectLastMrrNumber();
        if (mrrNumber.rows[0].MRRNO === null) {
            return Number(10001);
        } else {
            return mrrNumber.rows[0].MRRNO + 1;
        }
    } catch (err) {
        next(err);
    }
};

const newProductList = async (req, res, next) => {
    const { category_id } = req.params;
    try {
        const productListForNew = await selectNewProductListByCatId(category_id);
        res.json(createResponse(productListForNew.rows));
    } catch (err) {
        next(err.message);
    }
};

const manageProducts = async (_, res, next) => {
    try {
        const response = await selectCategoryWithStore();

        const redefinedResponse = response.rows.reduce((acc, obj, index) => {
            acc[0][index] = {
                CATEGORY_ID: obj.CATEGORY_ID,
                CATEGORY_NAME: obj.CATEGORY_NAME,
                ENTRIES: obj.CT,
                QUANTITIES: obj['SUM(QUANTITY)OVER(PARTITIONBYPL.CATEGORY_ID)'],
                NON_WORKABLE: obj['SUM(NON_WORKABLE)OVER(PARTITIONBYPL.CATEGORY_ID)']
            }
            acc[1] += obj['SUM(QUANTITY)OVER(PARTITIONBYPL.CATEGORY_ID)'];
            acc[2] += obj['SUM(NON_WORKABLE)OVER(PARTITIONBYPL.CATEGORY_ID)'];

            return acc;
        }, [[], 0, 0]);


        let result = {
            categories: redefinedResponse[0],
            totalProducts: redefinedResponse[1],
            totalquantites: redefinedResponse[2],
        };

        res.json(createResponse(result));
    } catch (err) {
        next(err);
    }
};

const getStrProductsbyCategoryId = async (req, res, next) => {
    try {
        const { category_id } = req.params;
        if (typeof (category_id) !== number && !category_id) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const response = await selectStrProductsByCatId(category_id);
            res.json(createResponse(response.rows));
        }
    } catch (err) {
        next(err.message)
    }

}





/*------------- All Post Controllers ---------------*/
const postProductEntrilist = async (req, res, next) => {
    const {
        supplier_id,
        products,
    } = req.body;
    try {
        const mrr_no = await lastMrrNum();
        if (mrr_no) {
            const postMrrLogs = await insertMrrLogs({ ...req.body, mrr_no });
            if (postMrrLogs.rowsAffected === 1) {
                let count = 0;
                products.forEach(async (product) => {
                    const postStorePro = await insertStoreProduct(product);

                    if (postStorePro.rowsAffected === 1) {

                        let indProducts = [];
                        for (let i = 0; i < product.qty; i++) {
                            if (product.non_workable > i) {
                                indProducts.push({
                                    STR_PRO_ID: postStorePro.outBinds.id[0],
                                    STATUS: 3   // product inactive
                                })
                            } else {
                                indProducts.push({
                                    STR_PRO_ID: postStorePro.outBinds.id[0],
                                    STATUS: 0   // product active
                                })
                            }
                        }
                        const postManyIndProd = await insertManyInd_Product(indProducts);
                        if (postManyIndProd.rowsAffected >= 1 && indProducts.length === product.qty) {
                            const postProEnList = await insertProductEntryLists(
                                { ...product, store_pro_id: postStorePro.outBinds.id[0] },
                                postMrrLogs["outBinds"]["id"][0],
                                supplier_id
                            );

                            const postProSum = await insertProdSummaries(
                                product,
                                postStorePro.outBinds.id[0]
                            );
                            if (!postProEnList.outBinds.id[0] || !postProSum.outBinds.id[0]) {
                                res.json(createResponse(null, "Error Occured In New Product Entry", true));
                            }
                            count++;
                            if (count === products.length) {
                                res.json(createResponse(null, "Product Insert Succesfully", false));
                            }
                        } else {
                            res.json(createResponse(null, "Error Occured In New Ind Product", true));
                        }
                    } else {
                        res.json(createResponse(null, "Error Occured In New Product Str", true));
                    }
                });
            } else {
                res.json(
                    createResponse(null, "Error Occured In Product Mrr!!", true)
                );
            }
        }

    } catch (err) {
        next(err);
    }
};





/*------------- All Update Controllers ---------------*/

const putProductEntrilist = async (req, res, next) => {
    const {
        supplier_id,
        products
    } = req.body;

    try {
        const mrr_no = await lastMrrNum();
        if (mrr_no) {
            const postMrrLogs = await insertMrrLogs({ ...req.body, mrr_no });
            if (postMrrLogs.rowsAffected === 1) {
                let count = 0;
                products.forEach(async (product) => {
                    if (product.str_pro_id) {
                        const updateStore = await updateStoreProduct(product);

                        if (updateStore.rowsAffected === 1) {
                            let indProducts = [];
                            for (let i = 0; i < product.qty; i++) {
                                if (product.non_workable > i) {
                                    indProducts.push({
                                        STR_PRO_ID: postStorePro.outBinds.id[0],
                                        STATUS: 3   // product inactive
                                    })
                                } else {
                                    indProducts.push({
                                        STR_PRO_ID: postStorePro.outBinds.id[0],
                                        STATUS: 0   // product active
                                    })
                                }
                            }
                            const postManyIndProd = await insertManyInd_Product(indProducts);
                            if (postManyIndProd.rowsAffected >= 1 && indProducts.length === product.qty) {
                                const postProEnList = await insertProductEntryLists(
                                    product,
                                    postMrrLogs["outBinds"]["id"][0],
                                    supplier_id,
                                );

                                const postProSum = await insertExProdSummaries(
                                    totalQuantities = updateStore.outBinds.storeQuantity[0],
                                    product
                                );
                                if (!postProEnList.outBinds.id[0] || !postProSum.outBinds.id[0]) {
                                    res.json(createResponse(null, "Error Occured In New Product Entry", true));
                                } else {
                                    res.json(createResponse(null, "Product Update Succesfully"));
                                }
                                count++;
                                if (count === products.length) {
                                    res.json(createResponse(null, "Product Update Succesfully", false));
                                }
                            } else {
                                res.json(createResponse(null, "Some Error Occured In New Product Update", true));
                            }
                        }
                    } else {
                        res.json(createResponse(null, "Some Error Occured In New Product Update", true));
                    }
                });
            } else {
                res.json(
                    createResponse(null, "Error Occured In Product Entry !!", true)
                );
            }
        }

    } catch (err) {
        next(err);
    }
};





/*------------- All Delete Controllers ---------------*/




module.exports = {
    newProductList,
    manageProducts,
    postProductEntrilist,
    putProductEntrilist
}