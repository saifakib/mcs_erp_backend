const { createResponse } = require("../../../utils/responseGenerator");
const { commitConnect, rollbackConnect, randConnect } = require('../../../utils/dbtransactions');

const { selectLastMrrNumber, selectIndProduct, selectStoreProducts, selectStoreProductsById, selectStoreProdCountByProId, selectIndStrProductsByStrId, selectNewProductListByCatId, selectStrProductsByCatId, selectCategoryWithStore, selectProductWithSup, selectIndStrProductsByProId, selectLastStrProdIndList, insertMrrLogs, insertStoreProduct, insertManyInd_Product, insertProductEntryLists, insertProdSummaries, insertExProdSummaries, updateStoreProduct, updateIndProduct, updateStrProNonWCount } = require("../../../services/it/product");
const { selectProductLists } = require("../../../services/it/settings")
const { number } = require("joi");
const shortid = require('shortid');
const { generator } = require("../../../utils/responseGenerator");


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
        if (typeof (category_id) !== number && !category_id) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const productListForNew = await selectNewProductListByCatId(category_id);
            res.json(createResponse(productListForNew.rows));
        }

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
                PRODUCT: obj.PRODUCT,
                ENTRIES: obj.CT,
                QUANTITIES: obj.QTY,
                NON_WORKABLE: obj.NON_QTY
            }
            acc[1] += obj.CT;
            acc[2] += obj.QTY,
                acc[3] += obj.NON_QTY,
                acc[4] += obj.PRODUCT
            return acc;
        }, [[], 0, 0, 0, 0]);


        let result = {
            categories: redefinedResponse[0],
            totalProducts: redefinedResponse[4],
            totalEntries: redefinedResponse[1],
            totalquantites: redefinedResponse[2],
            totalnonworkable: redefinedResponse[3],
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

const getStrProductsbyCatIdProdId = async (req, res, next) => {
    try {
        const { category_id, product_id } = req.params;
        if ((typeof (category_id) !== number && !category_id) && (typeof (product_id) !== number && !product_id)) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const response = await selectProductWithSup(product_id, category_id);
            res.json(createResponse(response.rows));
        }
    } catch (err) {
        next(err.message)
    }

}

const getIndStrProductsbyProId = async (req, res, next) => {
    try {
        const { supplier_id, product_id } = req.params;
        if ((typeof (product_id) !== number && !product_id) && typeof (supplier_id) !== number && !supplier_id) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const response = await selectIndStrProductsByProId(product_id, supplier_id);
            res.json(createResponse(response.rows));
        }
    } catch (err) {
        next(err.message)
    }
}

const getIndStrProductsbyStrId = async (req, res, next) => {
    try {
        const { supplier_id, product_id, str_pro_id } = req.params;
        if ((typeof (product_id) !== number && !product_id) && typeof (supplier_id) !== number && !supplier_id && typeof (str_pro_id) !== number && !str_pro_id) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const response = await selectIndStrProductsByStrId(product_id, supplier_id, str_pro_id);
            res.json(createResponse(response.rows));
        }
    } catch (err) {
        next(err.message)
    }
}

const getStoreProducts = async (_, res, next) => {
    try {
        const response = await selectStoreProducts();
        res.json(createResponse(response.rows));
    } catch (err) {
        next(err);
    }
};

const getStoreProductsById = async (req, res, next) => {
    try {
        const { str_pro_id } = req.params;
        if (typeof (str_pro_id) !== number && !str_pro_id) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const response = await selectStoreProductsById(str_pro_id);
            res.json(createResponse(response.rows[0]));
        }
    } catch (err) {
        next(err);
    }
};

const getStoreProdCountByProId = async (req, res, next) => {
    try {
        const { pro_id } = req.params;
        if ((typeof (pro_id) !== number && !pro_id)) {
            res.json(createResponse(null, "Something went wrong", true))
        } else {
            const response = await selectStoreProdCountByProId(pro_id);
            res.json(createResponse(response.rows, "Store Product By Sub Category"));
        }

    } catch (err) {
        next(err);
    }
};


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
                    const lastStrProdIndList = await selectLastStrProdIndList(product.pro_id);
                    const postStorePro = await insertStoreProduct(product);

                    if (postStorePro.rowsAffected === 1) {
                        const productInfo = await selectProductLists(product.pro_id);
                        const unique =  productInfo.rows[0].PRODUCT_NAME.slice(0, 3).toUpperCase() + "-" + postStorePro.outBinds.id[0].toString();

                        let gen;
                        //const lastStrProdIndList = await selectLastStrProdIndList(product.pro_id);
                        console.log(lastStrProdIndList)
                        if(lastStrProdIndList.rows.length > 0) {
                            let Uvalue = lastStrProdIndList.rows[0].UNIQUE_V;
                            let lastStrProdIndNumber = Number(Uvalue.substr(Uvalue.length - 4));
                            gen = generator(Number(lastStrProdIndNumber+1));
                        } else {
                            gen = generator(0001)
                        }
                        let indProducts = [];
                        for (let i = 0; i < product.qty; i++) {
                            if (product.non_workable > i) {
                                indProducts.push({
                                    STR_PRO_ID: postStorePro.outBinds.id[0],
                                    //UNIQUE_V: unique + shortid.generate(),
                                    UNIQUE_V: unique + String(gen.next().value).padStart(4, '0'),
                                    STATUS: 3,   // product inactive
                                    PRICE: product.price
                                })
                            } else {
                                indProducts.push({
                                    STR_PRO_ID: postStorePro.outBinds.id[0],
                                    UNIQUE_V: unique + String(gen.next().value).padStart(4, '0'),
                                    STATUS: 0,  // product active
                                    PRICE: product.price
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

// Update Individual Product Status
const putIndProduct = async (req, res, next) => {
    try {
        const { ind_product_id } = req.headers;
        const indProdInfo = await selectIndProduct(ind_product_id);
        if (indProdInfo.rows[0].STATUS === 3) {
            const changeIndProd = await updateIndProduct(ind_product_id, 0);

            if (changeIndProd.rowsAffected === 1) {
                const changeStrProById = await updateStrProNonWCount(indProdInfo.rows[0].STR_PRO_ID);
                if (changeStrProById.rowsAffected === 1) {
                    indProdInfo.rows[0].STATUS = 'Active'
                    res.json(createResponse(indProdInfo.rows[0], "Individual Product update Succesfully", false));
                }
            }
        }
        else {
            res.json(createResponse(indProdInfo.rows[0], "You are hitting a wrong product to change status", true))
        }
    } catch (err) {
        next(err.message)
    }
}

// const putProductEntrilist = async (req, res, next) => {
//     const {
//         supplier_id,
//         products
//     } = req.body;

//     try {
//         const mrr_no = await lastMrrNum();
//         if (mrr_no) {
//             const postMrrLogs = await insertMrrLogs({ ...req.body, mrr_no });
//             if (postMrrLogs.rowsAffected === 1) {
//                 let count = 0;
//                 products.forEach(async (product) => {
//                     if (product.str_pro_id) {
//                         const updateStore = await updateStoreProduct(product, stock_alert = false);

//                         if (updateStore.rowsAffected === 1) {
//                             let indProducts = [];
//                             for (let i = 0; i < product.qty; i++) {
//                                 if (product.non_workable > i) {
//                                     indProducts.push({
//                                         STR_PRO_ID: postStorePro.outBinds.id[0],
//                                         STATUS: 3   // product inactive
//                                     })
//                                 } else {
//                                     indProducts.push({
//                                         STR_PRO_ID: postStorePro.outBinds.id[0],
//                                         STATUS: 0   // product active
//                                     })
//                                 }
//                             }
//                             const postManyIndProd = await insertManyInd_Product(indProducts);
//                             if (postManyIndProd.rowsAffected >= 1 && indProducts.length === product.qty) {
//                                 const postProEnList = await insertProductEntryLists(
//                                     product,
//                                     postMrrLogs["outBinds"]["id"][0],
//                                     supplier_id,
//                                 );

//                                 const postProSum = await insertExProdSummaries(
//                                     totalQuantities = updateStore.outBinds.storeQuantity[0],
//                                     product
//                                 );
//                                 if (!postProEnList.outBinds.id[0] || !postProSum.outBinds.id[0]) {
//                                     res.json(createResponse(null, "Error Occured In New Product Entry", true));
//                                 } else {
//                                     res.json(createResponse(null, "Product Update Succesfully"));
//                                 }
//                                 count++;
//                                 if (count === products.length) {
//                                     res.json(createResponse(null, "Product Update Succesfully", false));
//                                 }
//                             } else {
//                                 res.json(createResponse(null, "Some Error Occured In New Product Update", true));
//                             }
//                         }
//                     } else {
//                         res.json(createResponse(null, "Some Error Occured In New Product Update", true));
//                     }
//                 });
//             } else {
//                 res.json(
//                     createResponse(null, "Error Occured In Product Entry !!", true)
//                 );
//             }
//         }

//     } catch (err) {
//         next(err);
//     }
// };

// const putStoreProductById = async (req, res, next) => {
//     try {
//         const { str_pro_id } = req.headers;
//         // const responses = await selectStoreProductsById(str_pro_id);
//         // {
//         //     STR_PRO_ID: 118,
//         //     PRODUCT_NAME: 'demoiq',
//         //     MODEL_NAME: 'fatemastore',
//         //     UNIT_NAME: 'Eden arif',
//         //     BRAND_NAME: 'dell',
//         //     PRICE: 111,
//         //     STOCK_ALERT: 1,
//         //     QUANTITY: 10,
//         //     NON_WORKABLE: 1,
//         //     STOCK_ALERT_1: 1
//         //   }
//         // if (response.rows[0].QUANTITY > req.body.qty) {

//         // } else {
//         //     let indProducts = [];
//         //     for (let i = 0; i < product.qty; i++) {
//         //         if (product.non_workable > i) {
//         //             indProducts.push({
//         //                 STR_PRO_ID: postStorePro.outBinds.id[0],
//         //                 STATUS: 3   // product inactive
//         //             })
//         //         } else {
//         //             indProducts.push({
//         //                 STR_PRO_ID: postStorePro.outBinds.id[0],
//         //                 STATUS: 0   // product active
//         //             })
//         //         }
//         //     }
//         // }
//         //res.json(createResponse(response.rows[0]));
//         const response = await updateStoreProduct({ str_pro_id, ...req.body }, store_alert = true, store_alert_number = req.body.stock_alert);
//         if (response.rowsAffected === 1) {
//             res.json(createResponse(null, "Store Updated"));
//         }

//     } catch (err) {
//         next(err);
//     }
// };





/*------------- All Delete Controllers ---------------*/




module.exports = {
    newProductList, getStoreProducts, getStoreProductsById, getStoreProdCountByProId, getIndStrProductsbyProId, getIndStrProductsbyStrId,
    manageProducts, getStrProductsbyCategoryId, getStrProductsbyCatIdProdId,
    postProductEntrilist,
    putIndProduct
}