const { getDesignationByEmpId } = require("./employeeBasic.services");

module.exports = {
    getDesignationByEmpIds: (req, res) => {
        const eId = req.body.emp_id
        getDesignationByEmpId(req, (err, results) => {
            if (err) {
                return res.json({
                    message: err,
                    data: null,
                    error: 5000
                });
            }
            return res.json({
                message: "get Successfully",
                data: results,
                error: null
            });
        })
    },

}