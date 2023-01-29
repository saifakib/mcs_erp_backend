const { ExecuteHR } = require("../../../utils/hrDynamicController");
module.exports = {
    getDesignationByEmpId: async (eId, callBack) => {
        const results = await ExecuteHR(`SELECT DG.DESIGNATION,E.DESIGNATION_ID FROM EMPLOYEE E 
        LEFT OUTER JOIN DESIGNATION DG ON DG.DESIGNATION_ID = E.DESIGNATION_ID  WHERE E.EMPLOYE_ID = ${eId}
        
        `, [], 1);
        if (results.data) {
            const designationData = results?.data.rows;
            callBack(null, designationData)
        }
        else {
            callBack(results.error)
        }

    },

}