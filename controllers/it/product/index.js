const { createResponse } = require("../../../utils/responseGenerator");
const { format } = require('date-fns');
const { commitConnect, rollbackConnect, randConnect } = require('../../../utils/dbtransactions');

const { insertMrrLogs, insertStoreProduct, insertManyInd_Product,  insertProductEntryLists, insertProdSummaries,
} = require("../../../services/it/product")


/*------------- All Get Controllers ---------------*/






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
                    console.log("Post Mant Individual Products",postManyIndProd)
                    

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
                        res.json(
                            createResponse(null,"Error Occured In New Product Entry",TextTrackCue)
                        );
                    }
                } else {
                    res.json(
                        createResponse(null,"Error Occured In New Product Entry",true
                        )
                    );
                }
                // res.json(createResponse(null, "Product Upload Succesfully"));
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






/*------------- All Delete Controllers ---------------*/




module.exports = {
    postProductEntrilist
}