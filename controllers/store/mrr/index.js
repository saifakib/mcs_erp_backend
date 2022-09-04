const { createResponse } = require("../../../utils/responseGenerator");
const { format } = require('date-fns');
const { getSupplierWithProductEntriesInfo, getRecentMonthSupply } = require("../../../services/store/mrr");

/*------------- All Get Controller ---------------*/

/**
 * Manage Supplier Conrtoller
 */
const manageSupplier = async (req, res, next) => {
    const date = new Date();
    let month = format(date, 'LLLL-yyyy');
    try {
        const suppliersWithEntriesInfo = await getSupplierWithProductEntriesInfo();
        const recentMonthSupply = await getRecentMonthSupply(month);

        const response = {
            suppliersWithEntriesInfo: suppliersWithEntriesInfo.rows,
            recentMonthSupply: recentMonthSupply.rows
        }
        
        res.json(createResponse(response))
    } catch(err) {
        next(err)
    }
}

module.exports = {
    manageSupplier
}