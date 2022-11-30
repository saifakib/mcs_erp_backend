const { createResponse } = require("../../../utils/responseGenerator");
const { format } = require('date-fns');

const { insertMrrLogs, insertStoreProduct, insertProductEntryLists, insertProdSummaries,
 } = require("../../../services/it/product")


/*------------- All Get Controllers ---------------*/






/*------------- All Post Controllers ---------------*/
const postProductEntrilist = async (req, res, next) => {
    const {
        supplier_id,
        products,
    } = req.body;
    console.log(req.body)

    let date = new Date();
    let currentDate = format(date, "yyyy-MM-dd");

    try {
        const postMrrLogs = await insertMrrLogs(
            req.body,
            currentDate
        );
        if (postMrrLogs.outBinds.id[0]) {
            // product should be an object
            products.forEach(async (product) => {
                const postStorePro = await insertStoreProduct(product);

                if (postStorePro.outBinds.id[0]) {
                    const postProEnList = await insertProductEntryLists(
                        product,
                        postMrrLogs["outBinds"]["id"][0],
                        supplier_id,
                        postStorePro.outBinds.id[0],
                        currentDate
                    );
                    // product.qty.reduce((item, ) => {

                    // })
                    const postProSum = await insertProdSummaries(
                        product,
                        postStorePro.outBinds.id[0],
                        currentDate
                    );

                    if (!postProEnList.outBinds.id[0] || !postProSum.outBinds.id[0]) {
                        res.json(
                            createResponse(
                                null,
                                "Error Occured In New Product Entry",
                                true
                            )
                        );
                    }
                } else {
                    res.json(
                        createResponse(
                            null,
                            "Some Error Occured In New Product Entry",
                            true
                        )
                    );
                }
            });
            res.json(createResponse(null, "Product Upload Succesfully"));
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