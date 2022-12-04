const { createResponse } = require("../../../utils/responseGenerator");
const { format } = require('date-fns');
const { commitConnect, rollbackConnect, randConnect } = require('../../../utils/dbtransactions');

const { selectNewProductListByCatId, insertMrrLogs, insertStoreProduct, insertManyInd_Product, insertProductEntryLists, insertProdSummaries, insertExProdSummaries, updateStoreProduct,
} = require("../../../services/it/product")


/*------------- All Get Controllers ---------------*/

const newProductList = async (req, res, next) => {
    const { category_id } = req.params;
    try {
        const productListForNew = await selectNewProductListByCatId(category_id);
        res.json(createResponse(productListForNew.rows));
    } catch (err) {
        next(err.message);
    }
};





/*------------- All Post Controllers ---------------*/
const postProductEntrilist = async (req, res, next) => {
    const {
        supplier_id,
        products,
    } = req.body;
    try {
        const postMrrLogs = await insertMrrLogs(req.body);

        if (postMrrLogs.rowsAffected === 1) {
            products.forEach(async (product) => {
                const postStorePro = await insertStoreProduct(product);

                if (postStorePro.rowsAffected === 1) {

                    let indProducts = [];
                    for (let i = 0; i < product.qty; i++) {
                        indProducts.push({
                            STR_PRO_ID: postStorePro.outBinds.id[0],
                            STATUS: 0
                        })
                    }
                    const postManyIndProd = await insertManyInd_Product(indProducts);
                    if (postManyIndProd.postManyIndProd >= 1 && indProducts.length === product.qty) {
                        const postProEnList = await insertProductEntryLists(
                            product,
                            postMrrLogs["outBinds"]["id"][0],
                            supplier_id,
                            postStorePro.outBinds.id[0]
                        );

                        const postProSum = await insertProdSummaries(
                            product,
                            postStorePro.outBinds.id[0]
                        );

                        if (!postProEnList.outBinds.id[0] || !postProSum.outBinds.id[0]) {
                            res.json(createResponse(null, "Error Occured In New Product Entry", true));
                        }
                        else {
                            res.json(createResponse(null, "Product Upload Succesfully"));
                        }
                    } else {
                        res.json(createResponse(null, "Error Occured In New Product Entry", true));
                    }
                } else {
                    res.json(createResponse(null, "Error Occured In New Product Entry", true));
                }
            });
        } else {
            res.json(
                createResponse(null, "Error Occured In Product Entry !!", true)
            );
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
        const postMrrLogs = await insertMrrLogs(req.body);
        if (postMrrLogs.rowsAffected === 1) {
            // product should be an object
            products.forEach(async (product) => {
                if (product.str_pro_id) {
                    const updateStore = await updateStoreProduct(product);

                    if (updateStore.rowsAffected === 1) {
                        let indProducts = [];
                        for (let i = 0; i < product.qty; i++) {
                            indProducts.push({
                                STR_PRO_ID: postStorePro.outBinds.id[0],
                                STATUS: 0
                            })
                        }
                        const postManyIndProd = await insertManyInd_Product(indProducts);
                        if (postManyIndProd.postManyIndProd >= 1 && indProducts.length === product.qty) {
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
    } catch (err) {
        next(err);
    }
};





/*------------- All Delete Controllers ---------------*/




module.exports = {
    newProductList,
    postProductEntrilist,
    putProductEntrilist
}